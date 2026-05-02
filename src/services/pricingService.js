/**
 * Motor de Precificação - Service
 * Implementa todas as fórmulas matemáticas conforme documentação
 */

class PricingService {
  /**
   * Calcula o custo de material
   * Fórmula: (Gramas / 1000) * Custo_Kg
   * @param {number} gramsUsed - Gramas de filamento
   * @param {number} costPerKg - Custo por Kg
   * @returns {number} Custo de material
   */
  calculateMaterialCost(gramsUsed, costPerKg) {
    if (gramsUsed < 0 || costPerKg < 0) {
      throw new Error('Gramas e custo devem ser valores positivos');
    }
    return (gramsUsed / 1000) * costPerKg;
  }

  /**
   * Calcula o custo de energia
   * Fórmula: (Potência_W / 1000) * Tempo_Horas * Tarifa_Kwh
   * @param {number} powerWatts - Potência em watts
   * @param {number} timeHours - Tempo de impressão em horas
   * @param {number} tarifaKwh - Tarifa por kWh
   * @returns {number} Custo de energia
   */
  calculateEnergyCost(powerWatts, timeHours, tarifaKwh) {
    if (powerWatts < 0 || timeHours < 0 || tarifaKwh < 0) {
      throw new Error('Potência, tempo e tarifa devem ser valores positivos');
    }
    return (powerWatts / 1000) * timeHours * tarifaKwh;
  }

  /**
   * Calcula a depreciação da máquina (opcional)
   * Fórmula: (Valor_Máquina / Vida_Útil_Horas) * Tempo_Horas
   * @param {number} machineValue - Valor da máquina
   * @param {number} lifeHours - Vida útil em horas
   * @param {number} timeHours - Tempo de uso nesta peça
   * @returns {number} Custo de depreciação
   */
  calculateDepreciation(machineValue, lifeHours, timeHours) {
    if (machineValue < 0 || lifeHours <= 0 || timeHours < 0) {
      throw new Error('Valores de depreciação inválidos');
    }
    if (lifeHours === 0) {
      throw new Error('Vida útil não pode ser zero');
    }
    return (machineValue / lifeHours) * timeHours;
  }

  /**
   * Calcula o preço base (antes de taxas e lucro)
   * Fórmula: Custo_Material + Custo_Energia + Depreciação
   * @param {number} materialCost - Custo de material
   * @param {number} energyCost - Custo de energia
   * @param {number} depreciation - Depreciação (padrão 0)
   * @returns {number} Preço base
   */
  calculateBasePrice(materialCost, energyCost, depreciation = 0) {
    return materialCost + energyCost + depreciation;
  }

  /**
   * Calcula taxa de risco/falha (opcional)
   * Fórmula: Preço_Base * (%Falha / 100)
   * @param {number} basePrice - Preço base
   * @param {number} failurePercentage - Percentual de falha (padrão 0)
   * @returns {number} Custo de risco
   */
  calculateRiskTax(basePrice, failurePercentage = 0) {
    if (failurePercentage < 0 || failurePercentage > 100) {
      throw new Error('Percentual de falha deve estar entre 0 e 100');
    }
    return basePrice * (failurePercentage / 100);
  }

  /**
   * Calcula custo de pós-processamento
   * Fórmula: Tempo_Trabalho_Horas * Taxa_Hora
   * @param {number} timeHours - Horas de trabalho
   * @param {number} hourlyRate - Taxa por hora
   * @returns {number} Custo de pós-processamento
   */
  calculatePostProcessing(timeHours, hourlyRate) {
    if (timeHours < 0 || hourlyRate < 0) {
      throw new Error('Tempo e taxa devem ser valores positivos');
    }
    return timeHours * hourlyRate;
  }

  /**
   * Calcula custo total de produção
   * Fórmula: Preço_Base + Taxa_Risco + Pós-processamento + Custos_Adicionais + Embalagem
   * @param {number} basePrice - Preço base
   * @param {number} riskTax - Taxa de risco
   * @param {number} postProcessing - Pós-processamento
   * @param {number} additionalCosts - Custos adicionais (padrão 0)
   * @param {number} packaging - Custo de embalagem (padrão 0)
   * @returns {number} Custo total de produção
   */
  calculateTotalProductionCost(basePrice, riskTax, postProcessing, additionalCosts = 0, packaging = 0) {
    return basePrice + riskTax + postProcessing + additionalCosts + packaging;
  }

  /**
   * Calcula lucro bruto
   * Fórmula: Custo_Produção * (%Markup / 100)
   * @param {number} totalProductionCost - Custo total de produção
   * @param {number} markupPercentage - Percentual de margem desejada
   * @returns {number} Lucro bruto
   */
  calculateProfit(totalProductionCost, markupPercentage) {
    if (markupPercentage < 0 || markupPercentage > 100) {
      throw new Error('Percentual de markup deve estar entre 0 e 100');
    }
    return totalProductionCost * (markupPercentage / 100);
  }

  /**
   * Calcula preço final de venda com taxa de plataforma/envio
   * Fórmula: (Custo_Produção + Lucro) / (1 - (%Taxa_Envio / 100))
   * Garante que após descontar a taxa, sobra exatamente o custo + lucro
   * @param {number} totalProductionCost - Custo total de produção
   * @param {number} profit - Lucro desejado
   * @param {number} platformFeePercentage - Percentual de taxa de plataforma (padrão 0)
   * @returns {number} Preço final de venda
   */
  calculateFinalPrice(totalProductionCost, profit, platformFeePercentage = 0) {
    if (platformFeePercentage < 0 || platformFeePercentage >= 100) {
      throw new Error('Percentual de taxa deve estar entre 0 e 99');
    }

    if (platformFeePercentage === 0) {
      return totalProductionCost + profit;
    }

    // Fórmula: (Custo + Lucro) / (1 - taxa%)
    return (totalProductionCost + profit) / (1 - (platformFeePercentage / 100));
  }

  /**
   * ENDPOINT PRINCIPAL: Calcula orçamento completo
   * Executa todas as fórmulas e retorna um objeto detalhado
   * @param {Object} input - Dados de entrada do orçamento
   * @returns {Object} Orçamento calculado com todos os detalhes
   */
  calculateQuote(input) {
    // Validações básicas
    this.validateQuoteInput(input);

    // 1. Custo de Material
    const costMaterial = this.calculateMaterialCost(input.gramsUsed, input.costPerKg);

    // 2. Custo de Energia
    const costEnergy = this.calculateEnergyCost(input.powerWatts, input.timeHours, input.tarifaKwh);

    // 3. Depreciação (opcional, padrão 0)
    let depreciation = 0;
    if (input.depreciation && input.depreciation.enabled && input.depreciation.machineValue && input.depreciation.lifeHours) {
      depreciation = this.calculateDepreciation(
        input.depreciation.machineValue,
        input.depreciation.lifeHours,
        input.timeHours
      );
    }

    // 4. Preço Base
    const priceBase = this.calculateBasePrice(costMaterial, costEnergy, depreciation);

    // 5. Taxa de Risco (opcional, padrão 0)
    let riskTax = 0;
    if (input.riskTax && input.riskTax.enabled && input.riskTax.failurePercentage !== undefined) {
      riskTax = this.calculateRiskTax(priceBase, input.riskTax.failurePercentage);
    }

    // 6. Pós-processamento (opcional, padrão 0)
    let postProcessing = 0;
    if (input.postProcessing && input.postProcessing.timeHours && input.postProcessing.hourlyRate) {
      postProcessing = this.calculatePostProcessing(input.postProcessing.timeHours, input.postProcessing.hourlyRate);
    }

    // 7. Custo Total de Produção
    const totalProductionCost = this.calculateTotalProductionCost(
      priceBase,
      riskTax,
      postProcessing,
      input.additionalCosts || 0,
      input.packaging || 0
    );

    // 8. Lucro
    const profit = this.calculateProfit(totalProductionCost, input.markupPercentage);

    // 9. Preço Final com Taxa de Plataforma
    const platformFeePercentage = input.platformFeePercentage || 0;
    const finalPrice = this.calculateFinalPrice(totalProductionCost, profit, platformFeePercentage);

    // Retorna orçamento completo com todos os detalhes
    return {
      gramsUsed: input.gramsUsed,
      costPerKg: input.costPerKg,
      powerWatts: input.powerWatts,
      timeHours: input.timeHours,
      tarifaKwh: input.tarifaKwh,
      markupPercentage: input.markupPercentage,
      depreciationInput: input.depreciation || null,
      riskTaxInput: input.riskTax || null,
      postProcessingInput: input.postProcessing || null,
      additionalCostsInput: input.additionalCosts || 0,
      packagingInput: input.packaging || 0,
      platformFeePercentageInput: platformFeePercentage,
      costMaterial: parseFloat(costMaterial.toFixed(2)),
      costEnergy: parseFloat(costEnergy.toFixed(2)),
      depreciation: parseFloat(depreciation.toFixed(2)),
      priceBase: parseFloat(priceBase.toFixed(2)),
      riskTax: parseFloat(riskTax.toFixed(2)),
      postProcessing: parseFloat(postProcessing.toFixed(2)),
      additionalCosts: parseFloat((input.additionalCosts || 0).toFixed(2)),
      packaging: parseFloat((input.packaging || 0).toFixed(2)),
      totalProductionCost: parseFloat(totalProductionCost.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      platformFeePercentage: platformFeePercentage,
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      markup: input.markupPercentage
    };
  }

  /**
   * Valida entrada de orçamento
   * @param {Object} input - Dados de entrada
   * @throws {Error} Se validação falhar
   */
  validateQuoteInput(input) {
    // Campos obrigatórios
    if (input.gramsUsed === undefined || input.gramsUsed < 0) {
      throw new Error('gramsUsed é obrigatório e deve ser um número positivo');
    }
    if (input.costPerKg === undefined || input.costPerKg < 0) {
      throw new Error('costPerKg é obrigatório e deve ser um número positivo');
    }
    if (input.powerWatts === undefined || input.powerWatts < 0) {
      throw new Error('powerWatts é obrigatório e deve ser um número positivo');
    }
    if (input.timeHours === undefined || input.timeHours < 0) {
      throw new Error('timeHours é obrigatório e deve ser um número positivo');
    }
    if (input.tarifaKwh === undefined || input.tarifaKwh < 0) {
      throw new Error('tarifaKwh é obrigatório e deve ser um número positivo');
    }
    if (input.markupPercentage === undefined || input.markupPercentage < 0 || input.markupPercentage > 100) {
      throw new Error('markupPercentage é obrigatório e deve estar entre 0 e 100');
    }

    // Validações de campos opcionais
    if (input.depreciation && input.depreciation.enabled) {
      if (!input.depreciation.machineValue || !input.depreciation.lifeHours) {
        throw new Error('Se depreciação está ativada, machineValue e lifeHours são obrigatórios');
      }
    }

    if (input.riskTax && input.riskTax.enabled) {
      if (input.riskTax.failurePercentage === undefined) {
        throw new Error('Se riskTax está ativada, failurePercentage é obrigatório');
      }
    }

    if (input.postProcessing) {
      if (input.postProcessing.timeHours && !input.postProcessing.hourlyRate) {
        throw new Error('Se postProcessing.timeHours está definido, hourlyRate é obrigatório');
      }
      if (!input.postProcessing.timeHours && input.postProcessing.hourlyRate) {
        throw new Error('Se postProcessing.hourlyRate está definido, timeHours é obrigatório');
      }
    }

    if (input.platformFeePercentage !== undefined && (input.platformFeePercentage < 0 || input.platformFeePercentage >= 100)) {
      throw new Error('platformFeePercentage deve estar entre 0 e 99');
    }
  }
}

module.exports = new PricingService();
