const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * ==========================================
 * ÉPICO 1: GESTÃO DE ACESSO E SEGURANÇA
 * ==========================================
 */

/**
 * US01: Cadastro de Administrador
 * POST /auth/register
 */
router.post(
  '/auth/register',
  authController.validateRegister,
  authController.register
);

/**
 * US02: Login e Geração de Token
 * POST /auth/login
 */
router.post(
  '/auth/login',
  authController.validateLogin,
  authController.login
);

/**
 * US03: Consulta Segura de Usuários
 * GET /users [PROTEGIDO]
 */
router.get(
  '/users',
  authMiddleware,
  authController.getUsers
);

/**
 * ==========================================
 * ÉPICO 2: MOTOR DE PRECIFICAÇÃO
 * ==========================================
 */

/**
 * US04 e US05: Cálculo de Orçamento (com ou sem taxas)
 * POST /quote/calculate [ABERTO OU PROTEGIDO]
 */
router.post(
  '/quote/calculate',
  productController.calculateQuote
);

/**
 * ==========================================
 * ÉPICO 3: GESTÃO DE CATÁLOGO DE PRODUTOS
 * ==========================================
 */

/**
 * US06: Conversão de Orçamento em Produto
 * POST /products [PROTEGIDO]
 */
router.post(
  '/products',
  authMiddleware,
  productController.validateCreateProduct,
  productController.createProduct
);

/**
 * US07: Consulta e Detalhamento de Catálogo
 * GET /products [PROTEGIDO]
 */
router.get(
  '/products',
  authMiddleware,
  productController.listProducts
);

/**
 * US07: Detalhamento de Produto Específico
 * GET /products/:id [PROTEGIDO]
 */
router.get(
  '/products/:id',
  authMiddleware,
  productController.validateProductId,
  productController.getProductDetail
);

/**
 * US08: Atualização de Parâmetros de Custo
 * PUT /products/:id [PROTEGIDO]
 */
router.put(
  '/products/:id',
  authMiddleware,
  productController.validateUpdateProduct,
  productController.updateProduct
);

/**
 * US09: Exclusão de Produto
 * DELETE /products/:id [PROTEGIDO]
 */
router.delete(
  '/products/:id',
  authMiddleware,
  productController.validateProductId,
  productController.deleteProduct
);

module.exports = router;
