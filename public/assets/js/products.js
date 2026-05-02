function renderProductList(products) {
  const list = document.getElementById('productsList');
  if (!list) return;

  if (!products.length) {
    list.innerHTML = '<div class="panel"><p>Nenhum produto cadastrado ainda.</p></div>';
    return;
  }

  list.innerHTML = products.map((product) => `
    <div class="item">
      <div>
        <h3>${product.name}</h3>
        <div class="meta">Final: ${formatCurrency(product.finalPrice)} • Custo: ${formatCurrency(product.totalProductionCost)} • Atualizado em ${formatDate(product.updatedAt)}</div>
      </div>
      <div class="actions">
        <a class="btn btn-secondary" href="product-detail.html?id=${product.id}">Detalhar</a>
        <a class="btn btn-ghost" href="product-edit.html?id=${product.id}">Editar</a>
        <button class="btn btn-danger" data-delete-product="${product.id}">Excluir</button>
      </div>
    </div>
  `).join('');

  qsa('[data-delete-product]').forEach((button) => {
    button.addEventListener('click', async () => {
      if (!confirm('Excluir este produto?')) return;
      try {
        await apiRequest(`/products/${button.dataset.deleteProduct}`, { method: 'DELETE' });
        notify('Produto excluído');
        loadProducts();
      } catch (error) {
        notify(error.message, 'error');
      }
    });
  });
}

async function loadProducts() {
  if (!requireAuth()) return;

  const list = document.getElementById('productsList');
  if (!list) return;

  list.innerHTML = '<div class="panel"><p>Carregando produtos...</p></div>';

  try {
    const response = await apiRequest('/products');
    renderProductList(response.products || []);
  } catch (error) {
    list.innerHTML = `<div class="panel"><p>${error.message}</p></div>`;
  }
}

function fillProductDetail(product) {
  const container = document.getElementById('productDetail');
  if (!container) return;

  const detailed = product.detailedCosts || {};
  container.innerHTML = `
    <div class="panel">
      <div class="inline" style="justify-content:space-between;">
        <div>
          <span class="badge">Produto ${product.id.slice(0, 8)}</span>
          <h2 style="margin-bottom:6px;">${product.name}</h2>
          <p>Preço final: <strong>${formatCurrency(product.finalPrice)}</strong></p>
        </div>
        <div class="inline">
          <a class="btn btn-secondary" href="product-edit.html?id=${product.id}">Editar</a>
          <button class="btn btn-danger" id="deleteCurrentProduct">Excluir</button>
        </div>
      </div>
    </div>

    <div class="grid two" style="margin-top:18px;">
      <div class="detail-card">
        <h3>Resumo financeiro</h3>
        <p>Material: ${formatCurrency(product.costMaterial)}</p>
        <p>Energia: ${formatCurrency(product.costEnergy)}</p>
        <p>Depreciação: ${formatCurrency(product.depreciation)}</p>
        <p>Risco: ${formatCurrency(product.riskTax)}</p>
        <p>Pós-processamento: ${formatCurrency(product.postProcessing)}</p>
        <p>Extras: ${formatCurrency(product.additionalCosts + product.packaging)}</p>
      </div>
      <div class="detail-card">
        <h3>Dados do orçamento</h3>
        <p>Gramas usadas: ${detailed.gramsUsed ?? '-'}</p>
        <p>Custo/kg: ${detailed.costPerKg ?? '-'}</p>
        <p>Potência: ${detailed.powerWatts ?? '-'}</p>
        <p>Tempo: ${detailed.timeHours ?? '-'}</p>
        <p>Tarifa kWh: ${detailed.tarifaKwh ?? '-'}</p>
        <p>Markup: ${detailed.markupPercentage ?? detailed.markup ?? '-'}</p>
        <p>Taxa da plataforma: ${product.platformFeePercentage}%</p>
      </div>
    </div>

    <div class="panel" style="margin-top:18px;">
      <h3>Histórico</h3>
      <p>Criado em ${formatDate(product.createdAt)} • Atualizado em ${formatDate(product.updatedAt)}</p>
      <p class="muted small">Todos os custos abaixo são reutilizados para edição e recálculo.</p>
    </div>
  `;

  const deleteButton = document.getElementById('deleteCurrentProduct');
  if (deleteButton) {
    deleteButton.addEventListener('click', async () => {
      if (!confirm('Excluir este produto?')) return;
      try {
        await apiRequest(`/products/${product.id}`, { method: 'DELETE' });
        notify('Produto excluído');
        window.location.href = 'products.html';
      } catch (error) {
        notify(error.message, 'error');
      }
    });
  }
}

async function loadProductDetail() {
  if (!requireAuth()) return;

  const id = new URLSearchParams(window.location.search).get('id');
  const container = document.getElementById('productDetail');
  if (!id || !container) return;

  container.innerHTML = '<div class="panel"><p>Carregando detalhes...</p></div>';

  try {
    const response = await apiRequest(`/products/${id}`);
    fillProductDetail(response.product);
  } catch (error) {
    container.innerHTML = `<div class="panel"><p>${error.message}</p></div>`;
  }
}

function fillProductEditForm(product) {
  const form = document.getElementById('editProductForm');
  if (!form) return;

  const detailed = product.detailedCosts || {};
  form.elements.name.value = product.name || '';
  form.elements.gramsUsed.value = detailed.gramsUsed ?? '';
  form.elements.costPerKg.value = detailed.costPerKg ?? '';
  form.elements.powerWatts.value = detailed.powerWatts ?? '';
  form.elements.timeHours.value = detailed.timeHours ?? '';
  form.elements.tarifaKwh.value = detailed.tarifaKwh ?? '';
  form.elements.markupPercentage.value = detailed.markupPercentage ?? detailed.markup ?? '';
  form.elements.platformFeePercentage.value = detailed.platformFeePercentage ?? product.platformFeePercentage ?? 0;
  form.elements.additionalCosts.value = detailed.additionalCosts ?? product.additionalCosts ?? 0;
  form.elements.packaging.value = detailed.packaging ?? product.packaging ?? 0;
  form.elements.machineValue.value = detailed.depreciationInput?.machineValue ?? '';
  form.elements.lifeHours.value = detailed.depreciationInput?.lifeHours ?? '';
  form.elements.failurePercentage.value = detailed.riskTaxInput?.failurePercentage ?? '';
  form.elements.postTimeHours.value = detailed.postProcessingInput?.timeHours ?? '';
  form.elements.hourlyRate.value = detailed.postProcessingInput?.hourlyRate ?? '';
  form.elements.enableDepreciation.checked = !!detailed.depreciationInput;
  form.elements.enableRiskTax.checked = !!detailed.riskTaxInput;
  form.elements.enablePostProcessing.checked = !!detailed.postProcessingInput;
}

async function loadProductEdit() {
  if (!requireAuth()) return;

  const id = new URLSearchParams(window.location.search).get('id');
  const form = document.getElementById('editProductForm');
  if (!id || !form) return;

  try {
    const response = await apiRequest(`/products/${id}`);
    fillProductEditForm(response.product);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const payload = {
        name: form.elements.name.value,
        gramsUsed: Number(form.elements.gramsUsed.value),
        costPerKg: Number(form.elements.costPerKg.value),
        powerWatts: Number(form.elements.powerWatts.value),
        timeHours: Number(form.elements.timeHours.value),
        tarifaKwh: Number(form.elements.tarifaKwh.value),
        markupPercentage: Number(form.elements.markupPercentage.value),
        platformFeePercentage: Number(form.elements.platformFeePercentage.value) || 0,
        additionalCosts: Number(form.elements.additionalCosts.value) || 0,
        packaging: Number(form.elements.packaging.value) || 0
      };

      if (form.elements.enableDepreciation.checked) {
        payload.depreciation = {
          enabled: true,
          machineValue: Number(form.elements.machineValue.value),
          lifeHours: Number(form.elements.lifeHours.value)
        };
      }

      if (form.elements.enableRiskTax.checked) {
        payload.riskTax = {
          enabled: true,
          failurePercentage: Number(form.elements.failurePercentage.value)
        };
      }

      if (form.elements.enablePostProcessing.checked) {
        payload.postProcessing = {
          timeHours: Number(form.elements.postTimeHours.value),
          hourlyRate: Number(form.elements.hourlyRate.value)
        };
      }

      try {
        await apiRequest(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        notify('Produto atualizado');
        window.location.href = `product-detail.html?id=${id}`;
      } catch (error) {
        notify(error.message, 'error');
      }
    });
  } catch (error) {
    notify(error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productsList')) loadProducts();
  if (document.getElementById('productDetail')) loadProductDetail();
  if (document.getElementById('editProductForm')) loadProductEdit();
});
