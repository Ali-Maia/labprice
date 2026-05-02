const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const { swaggerUi, specs } = require('./swagger/config');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * ==========================================
 * MIDDLEWARE
 * ==========================================
 */

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, '..', 'public')));

// Logging simples
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * ==========================================
 * DOCUMENTAÇÃO SWAGGER
 * ==========================================
 */

// Rota Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  swaggerOptions: {
    url: '/api-docs.json'
  }
}));

// JSON spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

/**
 * ==========================================
 * ROTAS
 * ==========================================
 */

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas da API
app.use('/', apiRoutes);

/**
 * ==========================================
 * TRATAMENTO DE ERROS
 * ==========================================
 */

// Rota não encontrada (404)
app.use((req, res) => {
  if (req.accepts('html') && !req.path.startsWith('/api')) {
    return res.status(404).sendFile(path.join(__dirname, '..', 'public', '404.html'));
  }

  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

/**
 * ==========================================
 * INICIALIZAÇÃO
 * ==========================================
 */

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║       LabPrice API - Servidor iniciado com sucesso     ║
╚════════════════════════════════════════════════════════╝

📌 Informações do Servidor:
   • Host: http://localhost:${PORT}
   • Ambiente: ${process.env.NODE_ENV || 'development'}
   
📚 Documentação:
   • Swagger UI: http://localhost:${PORT}/api-docs
   • Spec JSON: http://localhost:${PORT}/api-docs.json

🔗 Endpoints Principais:
   • POST   /auth/register              - Cadastro de usuário [US01]
   • POST   /auth/login                 - Login e gerar token [US02]
   • GET    /users                      - Listar usuários [US03] [Protegido]
   • POST   /quote/calculate            - Calcular orçamento [US04, US05]
   • POST   /products                   - Criar produto [US06] [Protegido]
   • GET    /products                   - Listar produtos [US07] [Protegido]
   • GET    /products/:id               - Detalhar produto [US07] [Protegido]
   • PUT    /products/:id               - Atualizar produto [US08] [Protegido]
   • DELETE /products/:id               - Deletar produto [US09] [Protegido]

💡 Próximos passos:
   1. Acesse http://localhost:${PORT}/api-docs para explorar a API
   2. Cadastre um usuário em POST /auth/register
   3. Faça login em POST /auth/login para obter o token JWT
   4. Use o token nos endpoints protegidos

💾 Banco de Dados: Em memória (estruturas de dados JavaScript)

════════════════════════════════════════════════════════════
  `);
});

module.exports = server;
