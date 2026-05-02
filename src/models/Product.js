const { v4: uuidv4 } = require('uuid');

/**
 * Modelo de Produto (em memória)
 * Armazena todos os produtos e seus detalhes de custo
 */
class ProductModel {
  constructor() {
    this.products = [];
  }

  /**
   * Cria um novo produto a partir de um orçamento calculado
   * @param {string} name - Nome do produto
   * @param {Object} quotationData - Dados do orçamento com detalhes de custos
   * @returns {Object} Produto criado
   */
  create(name, quotationData) {
    const product = {
      id: uuidv4(),
      name,
      priceBase: quotationData.priceBase,
      costMaterial: quotationData.costMaterial,
      costEnergy: quotationData.costEnergy,
      depreciation: quotationData.depreciation || 0,
      riskTax: quotationData.riskTax || 0,
      postProcessing: quotationData.postProcessing || 0,
      additionalCosts: quotationData.additionalCosts || 0,
      packaging: quotationData.packaging || 0,
      totalProductionCost: quotationData.totalProductionCost,
      profit: quotationData.profit,
      platformFeePercentage: quotationData.platformFeePercentage || 0,
      finalPrice: quotationData.finalPrice,
      detailedCosts: quotationData, // Mantém histórico completo
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.products.push(product);
    return product;
  }

  /**
   * Busca produto por ID
   * @param {string} id
   * @returns {Object|null} Produto ou null
   */
  findById(id) {
    return this.products.find(product => product.id === id) || null;
  }

  /**
   * Lista todos os produtos com resumo (sem detalhes completos)
   * @returns {Array} Lista de produtos
   */
  getAll() {
    return this.products.map(product => ({
      id: product.id,
      name: product.name,
      totalProductionCost: product.totalProductionCost,
      profit: product.profit,
      finalPrice: product.finalPrice,
      platformFeePercentage: product.platformFeePercentage,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
  }

  /**
   * Atualiza um produto existente
   * @param {string} id - ID do produto
   * @param {Object} updatedData - Dados atualizados
   * @returns {Object|null} Produto atualizado ou null
   */
  update(id, updatedData) {
    const product = this.findById(id);
    if (!product) return null;

    const updated = {
      ...product,
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = updated;
    }
    return updated;
  }

  /**
   * Deleta um produto
   * @param {string} id - ID do produto
   * @returns {boolean} True se deletado, false se não encontrado
   */
  delete(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    return true;
  }

  /**
   * Retorna o total de produtos
   * @returns {number}
   */
  count() {
    return this.products.length;
  }

  /**
   * Limpa todos os produtos (apenas para testes)
   */
  clear() {
    this.products = [];
  }
}

module.exports = new ProductModel();
