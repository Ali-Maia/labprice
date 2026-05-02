describe('API - Autenticação', () => {
  const password = 'senha123';

  const buildUser = () => {
    const suffix = Date.now();

    return {
      username: `testuser${suffix}`,
      email: `testuser${suffix}@labprice.com`,
      password
    };
  };

  it('deve registrar um usuário via API', () => {
    const user = buildUser();

    cy.request('POST', '/auth/register', user).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('user');
    });
  });

  it('deve realizar login via API', () => {
    const user = buildUser();

    cy.request('POST', '/auth/register', user).then(() => {
      cy.request('POST', '/auth/login', {
        email: user.email,
        password: user.password
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
      });
    });
  });
});
