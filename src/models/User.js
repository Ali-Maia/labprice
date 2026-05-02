const { v4: uuidv4 } = require('uuid');

/**
 * Modelo de Usuário (em memória)
 * Armazena todos os usuários cadastrados
 */
class UserModel {
  constructor() {
    this.users = [];
  }

  /**
   * Cria um novo usuário
   * @param {string} username - Nome de usuário (alfanumérico)
   * @param {string} email - Email do usuário
   * @param {string} passwordHash - Senha com hash bcrypt
   * @returns {Object} Usuário criado
   */
  create(username, email, passwordHash) {
    const user = {
      id: uuidv4(),
      username,
      email,
      password: passwordHash,
      createdAt: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  /**
   * Busca usuário por email
   * @param {string} email
   * @returns {Object|null} Usuário ou null
   */
  findByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  /**
   * Busca usuário por username
   * @param {string} username
   * @returns {Object|null} Usuário ou null
   */
  findByUsername(username) {
    return this.users.find(user => user.username === username) || null;
  }

  /**
   * Busca usuário por ID
   * @param {string} id
   * @returns {Object|null} Usuário ou null
   */
  findById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  /**
   * Lista todos os usuários (sem passwords)
   * @returns {Array} Lista de usuários
   */
  getAll() {
    return this.users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    }));
  }

  /**
   * Retorna o total de usuários
   * @returns {number}
   */
  count() {
    return this.users.length;
  }

  /**
   * Limpa todos os usuários (apenas para testes)
   */
  clear() {
    this.users = [];
  }
}

module.exports = new UserModel();
