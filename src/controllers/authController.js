const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');

/**
 * Controller de Autenticação
 * Gerencia cadastro, login e consulta de usuários
 */

/**
 * US01: Cadastro de Administrador
 * POST /auth/register
 */
const register = async (req, res) => {
  try {
    // Valida dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Verifica se usuário já existe
    if (UserModel.findByUsername(username)) {
      return res.status(400).json({
        error: 'Username já está em uso'
      });
    }

    if (UserModel.findByEmail(email)) {
      return res.status(400).json({
        error: 'Email já está cadastrado'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuário
    const user = UserModel.create(username, email, hashedPassword);

    // Retorna usuário sem senha
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao cadastrar usuário',
      message: error.message
    });
  }
};

/**
 * US02: Login e Geração de Token
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    // Busca usuário por email
    const user = UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }

    // Compara senhas
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }

    // Gera token JWT
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao fazer login',
      message: error.message
    });
  }
};

/**
 * US03: Consulta Segura de Usuários (Protegida)
 * GET /users
 */
const getUsers = (req, res) => {
  try {
    // req.user já foi preenchido pelo authMiddleware
    const users = UserModel.getAll();

    res.status(200).json({
      message: 'Lista de usuários recuperada com sucesso',
      total: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar usuários',
      message: error.message
    });
  }
};

/**
 * Validadores para registro
 */
const validateRegister = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username deve ter entre 3 e 20 caracteres')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Username deve conter apenas caracteres alfanuméricos [RN01]')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido [RN01]')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres [RN01]')
    .custom((value) => {
      // Rejeita senhas com caracteres invisíveis ou espaços nas extremidades
      if (value !== value.trim()) {
        throw new Error('Senha não pode conter espaços nas extremidades [RN01]');
      }
      // Detecta caracteres zero-width
      if (/[\u200B-\u200D\uFEFF]/.test(value)) {
        throw new Error('Senha contém caracteres inválidos [RN01]');
      }
      return true;
    })
];

/**
 * Validadores para login
 */
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

module.exports = {
  register,
  login,
  getUsers,
  validateRegister,
  validateLogin
};
