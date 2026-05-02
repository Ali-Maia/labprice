const { body, param, validationResult } = require('express-validator');
const ProductModel = require('../models/Product');
const pricingService = require('../services/pricingService');

/**
 * Controller de Produtos
 * Gerencia CRUD de produtos
 */

/**
 * US04 e US05: Cálculo de Orçamento (com ou sem taxas)
 * POST /quote/calculate
 */
const calculateQuote = (req, res) => {
  try {
    const { 
      gramsUsed, 
      costPerKg, 
      powerWatts, 
      timeHours, 
      tarifaKwh, 
      markupPercentage,
      depreciation,
      riskTax,
      postProcessing,
      additionalCosts,
      packaging,
      platformFeePercentage 
    } = req.body;

    // Calcula orçamento usando o motor de precificação
    const quotation = pricingService.calculateQuote({
      gramsUsed,
      costPerKg,
      powerWatts,
      timeHours,
      tarifaKwh,
      markupPercentage,
      depreciation,
      riskTax,
      postProcessing,
      additionalCosts,
      packaging,
      platformFeePercentage
    });

    res.status(200).json({
      message: 'Orçamento calculado com sucesso',
      quotation
    });
  } catch (error) {
    res.status(400).json({
      error: 'Erro ao calcular orçamento',
      message: error.message
    });
  }
};

/**
 * US06: Conversão de Orçamento em Produto (Protegido)
 * POST /products
 */
const createProduct = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors.array()
      });
    }

    const { name, quotationData } = req.body;

    // Valida que o orçamento contém todos os campos necessários [RN05]
    if (!quotationData || !quotationData.finalPrice || quotationData.totalProductionCost === undefined) {
      return res.status(400).json({
        error: 'Dados de orçamento inválidos ou incompletos [RN05]'
      });
    }

    // Cria produto com dados do orçamento
    const product = ProductModel.create(name, quotationData);

    res.status(201).json({
      message: 'Produto criado com sucesso a partir do orçamento [US06]',
      product
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar produto',
      message: error.message
    });
  }
};

/**
 * US07: Listar Produtos (Protegido)
 * GET /products
 */
const listProducts = (req, res) => {
  try {
    const products = ProductModel.getAll();

    res.status(200).json({
      message: 'Produtos listados com sucesso [US07]',
      total: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar produtos',
      message: error.message
    });
  }
};

/**
 * US07: Detalhamento de Produto (Protegido)
 * GET /products/:id
 */
const getProductDetail = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const product = ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        error: 'Produto não encontrado'
      });
    }

    // Retorna produto com detalhamento completo de custos [RN05]
    res.status(200).json({
      message: 'Detalhes do produto recuperados com sucesso [US07]',
      product: {
        id: product.id,
        name: product.name,
        costMaterial: product.costMaterial,
        costEnergy: product.costEnergy,
        depreciation: product.depreciation,
        priceBase: product.priceBase,
        riskTax: product.riskTax,
        postProcessing: product.postProcessing,
        additionalCosts: product.additionalCosts,
        packaging: product.packaging,
        totalProductionCost: product.totalProductionCost,
        profit: product.profit,
        platformFeePercentage: product.platformFeePercentage,
        finalPrice: product.finalPrice,
        detailedCosts: product.detailedCosts, // Histórico completo
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar produto',
      message: error.message
    });
  }
};

/**
 * US08: Atualizar Parâmetros de Custo (Protegido)
 * PUT /products/:id
 * Qualquer alteração nas variáveis recalcula automaticamente o preço [RN06]
 */
const updateProduct = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Busca produto existente
    const product = ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        error: 'Produto não encontrado'
      });
    }

    // Se houver alteração em variáveis de custo, recalcula [RN06]
    let updatedProduct = product;
    if (shouldRecalculate(updateData)) {
      // Monta dados de entrada para recálculo
      const recalculateData = {
        gramsUsed: updateData.gramsUsed !== undefined ? updateData.gramsUsed : product.detailedCosts.gramsUsed,
        costPerKg: updateData.costPerKg !== undefined ? updateData.costPerKg : product.detailedCosts.costPerKg,
        powerWatts: updateData.powerWatts !== undefined ? updateData.powerWatts : product.detailedCosts.powerWatts,
        timeHours: updateData.timeHours !== undefined ? updateData.timeHours : product.detailedCosts.timeHours,
        tarifaKwh: updateData.tarifaKwh !== undefined ? updateData.tarifaKwh : product.detailedCosts.tarifaKwh,
        markupPercentage: updateData.markupPercentage !== undefined ? updateData.markupPercentage : product.detailedCosts.markup,
        depreciation: updateData.depreciation !== undefined ? updateData.depreciation : product.detailedCosts.depreciation,
        riskTax: updateData.riskTax !== undefined ? updateData.riskTax : product.detailedCosts.riskTax,
        postProcessing: updateData.postProcessing !== undefined ? updateData.postProcessing : product.detailedCosts.postProcessing,
        additionalCosts: updateData.additionalCosts !== undefined ? updateData.additionalCosts : product.detailedCosts.additionalCosts,
        packaging: updateData.packaging !== undefined ? updateData.packaging : product.detailedCosts.packaging,
        platformFeePercentage: updateData.platformFeePercentage !== undefined ? updateData.platformFeePercentage : product.detailedCosts.platformFeePercentage
      };

      // Recalcula usando o serviço de precificação
      const newQuotation = pricingService.calculateQuote(recalculateData);

      // Atualiza produto com novos valores
      updatedProduct = ProductModel.update(id, {
        priceBase: newQuotation.priceBase,
        costMaterial: newQuotation.costMaterial,
        costEnergy: newQuotation.costEnergy,
        depreciation: newQuotation.depreciation,
        riskTax: newQuotation.riskTax,
        postProcessing: newQuotation.postProcessing,
        additionalCosts: newQuotation.additionalCosts,
        packaging: newQuotation.packaging,
        totalProductionCost: newQuotation.totalProductionCost,
        profit: newQuotation.profit,
        platformFeePercentage: newQuotation.platformFeePercentage,
        finalPrice: newQuotation.finalPrice,
        detailedCosts: newQuotation
      });
    } else {
      // Apenas atualiza nome se não houver alteração de custos
      if (updateData.name) {
        updatedProduct = ProductModel.update(id, { name: updateData.name });
      }
    }

    res.status(200).json({
      message: 'Produto atualizado com sucesso [US08]',
      product: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      error: 'Erro ao atualizar produto',
      message: error.message
    });
  }
};

/**
 * US09: Deletar Produto (Protegido)
 * DELETE /products/:id
 */
const deleteProduct = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors.array()
      });
    }

    const { id } = req.params;

    const deleted = ProductModel.delete(id);
    if (!deleted) {
      return res.status(404).json({
        error: 'Produto não encontrado'
      });
    }

    res.status(200).json({
      message: 'Produto deletado com sucesso [US09]'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao deletar produto',
      message: error.message
    });
  }
};

/**
 * Determina se deve recalcular o produto
 * @param {Object} updateData - Dados de atualização
 * @returns {boolean}
 */
function shouldRecalculate(updateData) {
  const costFields = [
    'gramsUsed', 'costPerKg', 'powerWatts', 'timeHours', 'tarifaKwh',
    'markupPercentage', 'depreciation', 'riskTax', 'postProcessing',
    'additionalCosts', 'packaging', 'platformFeePercentage'
  ];
  return Object.keys(updateData).some(key => costFields.includes(key));
}

/**
 * Validadores para criar produto
 */
const validateCreateProduct = [
  body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome do produto deve ter entre 3 e 100 caracteres [US06]')
    .trim(),
  body('quotationData')
    .notEmpty()
    .withMessage('Dados de orçamento são obrigatórios [RN05]')
];

/**
 * Validadores para listar/detalhar produto
 */
const validateProductId = [
  param('id')
    .isUUID()
    .withMessage('ID do produto deve ser um UUID válido')
];

/**
 * Validadores para atualizar produto
 */
const validateUpdateProduct = [
  param('id')
    .isUUID()
    .withMessage('ID do produto deve ser um UUID válido')
];

module.exports = {
  calculateQuote,
  createProduct,
  listProducts,
  getProductDetail,
  updateProduct,
  deleteProduct,
  validateCreateProduct,
  validateProductId,
  validateUpdateProduct
};
