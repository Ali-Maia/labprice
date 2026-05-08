describe('API - Autenticação', () => {

  const uniqueUser = () => {
		const suffix = Date.now();

		return {
			username: `admin${suffix}`,
			email: `admin${suffix}@labprice.com`,
			password: 'senha123'
		};
	};

  let validUser;

  before(() => {
      validUser = uniqueUser();
  });

  describe('Testes Registro', () => {

    it('TC-AUTH-001: Cadastro de Administrador com Dados Válidos', () => {

      cy.request(
        {
          method: 'POST',
          url: '/auth/register',
          body: validUser
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('user');
        });
    });

    it('TC-AUTH-002: Rejeição de Cadastro - Username com Caracteres Especiais', () => {
      const invalidUsernameUser = {
        ...uniqueUser(),
        username: "admin@#$%"
      };

      cy.request({
        method: 'POST',
        url: '/auth/register',
        failOnStatusCode: false,
        body: invalidUsernameUser
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.details[0].msg).to.eq('Username deve conter apenas caracteres alfanuméricos [RN01]');
      });
    });

    it('TC-AUTH-003: Rejeição de Cadastro - Sanitização de Senha', () => {
      const invalidPasswordUser = {
        ...uniqueUser(),
        password: " 1234  "
      };

      cy.request({
        method: 'POST',
        url: '/auth/register',
        failOnStatusCode: false,
        body: invalidPasswordUser
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.details[0].msg).to.eq('Senha não pode conter espaços nas extremidades [RN01]');
      });
    });

    it('TC-AUTH-004: Rejeição de Cadastro - Tamanho Mínimo', () => {
      const invalidPasswordUser = {
        ...uniqueUser(),
        password: "1234 "
      };

      cy.request({
        method: 'POST',
        url: '/auth/register',
        failOnStatusCode: false,
        body: invalidPasswordUser
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.details[0].msg).to.eq('Senha deve ter no mínimo 6 caracteres [RN01]');
      });
    });

  });

  describe('Testes Login', () => {

    it('TC-AUTH-005: Login de Usuário com Sucesso e Geração de JWT', () => {
      const loginCredentials = {
        email: validUser.email,
        password: validUser.password
      };

      cy.request('POST', '/auth/login', loginCredentials).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
      });
    });

    it('TC-AUTH-006: Rejeição de Login com Credenciais Inválidas - Senha', () => {
      const invalidLoginCredentials = {
        email: validUser.email,
        password: "senhaIncorreta"
      };

      cy.request({
        method: 'POST',
        url: '/auth/login',
        failOnStatusCode: false,
        body: invalidLoginCredentials
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.error).to.eq('Credenciais inválidas');
      });
    });

    it('TC-AUTH-007: Rejeição de Login com Credenciais Inválidas - Email', () => {
      const invalidLoginCredentials = {
        email: 'usuarioInavlido',
        password: validUser.password
      };

      cy.request({
        method: 'POST',
        url: '/auth/login',
        failOnStatusCode: false,
        body: invalidLoginCredentials
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.error).to.eq('Credenciais inválidas');
      });
    });
  });
});
