function readOptionalGroup(checkboxId, fields) {
  const enabled = document.getElementById(checkboxId)?.checked;
  if (!enabled) return undefined;

  const group = {};
  fields.forEach((field) => {
    const value = document.getElementById(field)?.value;
    if (value !== '' && value !== null && value !== undefined) {
      group[field] = Number(value);
    }
  });
  return group;
}

function readQuotePayload() {
  return {
    gramsUsed: Number(document.getElementById('gramsUsed').value),
    costPerKg: Number(document.getElementById('costPerKg').value),
    powerWatts: Number(document.getElementById('powerWatts').value),
    timeHours: Number(document.getElementById('timeHours').value),
    tarifaKwh: Number(document.getElementById('tarifaKwh').value),
    markupPercentage: Number(document.getElementById('markupPercentage').value),
    platformFeePercentage: Number(document.getElementById('platformFeePercentage').value) || 0,
    additionalCosts: Number(document.getElementById('additionalCosts').value) || 0,
    packaging: Number(document.getElementById('packaging').value) || 0,
    depreciation: readOptionalGroup('enableDepreciation', ['machineValue', 'lifeHours'])
      ? {
          enabled: true,
          machineValue: Number(document.getElementById('machineValue').value),
          lifeHours: Number(document.getElementById('lifeHours').value)
        }
      : undefined,
    riskTax: readOptionalGroup('enableRiskTax', ['failurePercentage'])
      ? {
          enabled: true,
          failurePercentage: Number(document.getElementById('failurePercentage').value)
        }
      : undefined,
    postProcessing: readOptionalGroup('enablePostProcessing', ['postTimeHours', 'hourlyRate'])
      ? {
          timeHours: Number(document.getElementById('postTimeHours').value),
          hourlyRate: Number(document.getElementById('hourlyRate').value)
        }
      : undefined
  };
}

function renderQuoteResult(quotation, payload) {
  const output = document.getElementById('quoteResult');
  if (!output) return;

  output.innerHTML = `
    <div class="summary">
      <div class="box"><small>Custo do material</small><strong>${formatCurrency(quotation.costMaterial)}</strong></div>
      <div class="box"><small>Custo de energia</small><strong>${formatCurrency(quotation.costEnergy)}</strong></div>
      <div class="box"><small>Custo total</small><strong>${formatCurrency(quotation.totalProductionCost)}</strong></div>
      <div class="box"><small>Preço final</small><strong>${formatCurrency(quotation.finalPrice)}</strong></div>
    </div>
    <hr class="sep">
    <div class="grid two">
      <div class="panel">
        <h3>Detalhamento</h3>
        <p>Base: ${formatCurrency(quotation.priceBase)}</p>
        <p>Depreciação: ${formatCurrency(quotation.depreciation)}</p>
        <p>Risco: ${formatCurrency(quotation.riskTax)}</p>
        <p>Pós-processamento: ${formatCurrency(quotation.postProcessing)}</p>
      </div>
      <div class="panel">
        <h3>Resumo comercial</h3>
        <p>Lucro: ${formatCurrency(quotation.profit)}</p>
        <p>Taxa da plataforma: ${quotation.platformFeePercentage}%</p>
        <p>Markup: ${quotation.markup}%</p>
        <p>Embalagem e extras: ${formatCurrency((quotation.packaging || 0) + (quotation.additionalCosts || 0))}</p>
      </div>
    </div>
    <div class="inline" style="margin-top:16px;">
      <span class="badge success">Orçamento calculado</span>
      <span class="muted small">Guarde este orçamento como produto se desejar.</span>
    </div>
  `;

  const saveSection = document.getElementById('saveQuoteSection');
  if (saveSection) {
    saveSection.classList.remove('hidden');
    saveSection.dataset.quotation = JSON.stringify({ ...payload, ...quotation });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  const saveButton = document.getElementById('saveQuoteButton');
  const productNameInput = document.getElementById('productName');

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = readQuotePayload();

    try {
      const response = await apiRequest('/quote/calculate', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      renderQuoteResult(response.quotation, payload);
    } catch (error) {
      notify(error.message, 'error');
    }
  });

  if (saveButton) {
    saveButton.addEventListener('click', async () => {
      if (!requireAuth()) return;

      const saveSection = document.getElementById('saveQuoteSection');
      if (!saveSection?.dataset.quotation) {
        notify('Calcule o orçamento antes de salvar.', 'error');
        return;
      }

      const quotationData = JSON.parse(saveSection.dataset.quotation);
      const name = productNameInput?.value?.trim();
      if (!name) {
        notify('Informe o nome do produto.', 'error');
        return;
      }

      try {
        await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify({ name, quotationData })
        });
        notify('Produto criado com sucesso');
        window.location.href = 'products.html';
      } catch (error) {
        notify(error.message, 'error');
      }
    });
  }
});
