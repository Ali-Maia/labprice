const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'labprice_secret_key_dev';
const JWT_EXPIRATION = '7d';

/**
 * Middleware para verificar JWT
 * Valida token no header: Authorization: Bearer <token>
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se header existe e está no formato correto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token JWT não fornecido ou inválido'
    });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Adiciona usuário ao objeto request
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token inválido ou expirado'
    });
  }
};

/**
 * Gera um token JWT para um usuário
 * @param {Object} user - Usuário (id, username, email)
 * @returns {string} Token JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
};

module.exports = {
  authMiddleware,
  generateToken,
  JWT_SECRET,
  JWT_EXPIRATION
};
