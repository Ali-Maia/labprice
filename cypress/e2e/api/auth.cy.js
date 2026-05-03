describe('API - Autenticação', () => {
  describe('Testes Registro', () => {

    it('TC-AUTH-001: Cadastro de Administrador com Dados Válidos', () => {
      const user = {
        username: "admin123",
        email: "admin@macuxi.com",
        password: "passwordSegura123"
      };

      cy.request(
        {
          method: 'POST',
          url: '/auth/register',
          body: user
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('user');
        });
    });

    it('TC-AUTH-002: Rejeição de Cadastro - Username com Caracteres Especiais', () => {
      const user = {
        username: "admin@#$%",
        email: "teste@macuxi.com",
        password: "password123"
      };

      cy.request({
        method: 'POST',
        url: '/auth/register',
        failOnStatusCode: false,
        body: user
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.details[0].msg).to.eq('Username deve conter apenas caracteres alfanuméricos [RN01]');
      });
    });

    it('TC-AUTH-003: Rejeição de Cadastro - Sanitização de Senha e Tamanho Mínimo', () => {
      const user = {
        username: "admin",
        email: "teste2@macuxi.com",
        senha: " 1234  "
      }

      cy.request({
        method: 'POST',
        url: '/auth/register',
        failOnStatusCode: false,
        body: user
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.details[0].msg).to.eq('Senha deve ter no mínimo 6 caracteres [RN01]');
      });
    });

  });

  describe('Testes Login', () => {

    it('TC-AUTH-004: Login de Usuário com Sucesso e Geração de JWT', () => {
      const user = {
        email: "admin@macuxi.com",
        password: "passwordSegura123"
      };

      cy.request('POST', '/auth/login', user).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
      });
    });

    it('TC-AUTH-005: Rejeição de Login com Credenciais Inválidas', () => {
      const user = {
        email: "admin@macuxi.com",
        password: "senhaIncorreta"
      };

      cy.request({
        method: 'POST',
        url: '/auth/login',
        failOnStatusCode: false,
        body: user
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.error).to.eq('Credenciais inválidas');
      });
    });
  });
});
