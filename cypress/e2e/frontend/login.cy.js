describe('Front-end - Login', () => {
  const suffix = String(Date.now()).slice(-4);

  const user = {
    username: `lg${suffix}`,
    email: `login${suffix}@labprice.com`,
    password: 'senha123'
  };

  before(() => {
    cy.request({
      method: 'POST',
      url: '/auth/register',
      failOnStatusCode: false,
      body: user
    }).then((response) => {
      expect([201, 400]).to.include(response.status);
    });
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login.html');
    cy.contains('Entrar').should('be.visible');
  });

  it('TC-FE-006: Login com sucesso na página login.html', () => {
    cy.intercept('POST', '/auth/login').as('login');

    cy.get('#email').type(user.email);
    cy.get('#password').type(user.password);
    cy.contains('button', 'Entrar').click();

    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('token');
    });

    cy.location('pathname').should('include', 'dashboard.html');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('labprice_token')).to.not.be.null;
      expect(win.localStorage.getItem('labprice_user')).to.not.be.null;
    });

    cy.location('pathname').should('include', 'dashboard.html');
  });

  it('TC-FE-007: Feedback de credenciais inválidas', () => {
    cy.intercept('POST', '/auth/login').as('login');

    cy.get('#email').type(user.email);
    cy.get('#password').type('senhaIncorreta');
    cy.contains('button', 'Entrar').click();

    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(401);
      expect(response.body.error).to.eq('Credenciais inválidas');
    });

    cy.contains('.toast', 'Credenciais inválidas').should('be.visible');
    cy.get('#email').should('have.value', user.email);
    cy.window().then((win) => {
      expect(win.localStorage.getItem('labprice_token')).to.be.null;
    });
  });

  it('TC-FE-008: Bloqueio de login com campos vazios', () => {
    cy.get('#loginForm').then(($form) => {
      $form[0].requestSubmit();
    });

    cy.focused().should('have.attr', 'id', 'email');
    cy.get('#loginForm').then(($form) => {
      expect($form[0].checkValidity()).to.be.false;
    });
  });

  it('TC-FE-009: Logout na barra de navegação', () => {
    cy.intercept('POST', '/auth/login').as('login');

    cy.get('#email').type(user.email);
    cy.get('#password').type(user.password);
    cy.contains('button', 'Entrar').click();

    cy.wait('@login');
    cy.location('pathname').should('include', 'dashboard.html');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('labprice_token')).to.not.be.null;
    });

    cy.contains('button', 'Sair').click();

    cy.window().then((win) => {
      expect(win.localStorage.getItem('labprice_token')).to.be.null;
      expect(win.localStorage.getItem('labprice_user')).to.be.null;
    });

    cy.location('pathname').should('include', 'index.html');
  });

  it('TC-FE-010: Proteção de rotas privadas no front-end', () => {
    cy.clearLocalStorage();
    cy.visit('/dashboard.html');

    cy.location('pathname').should('include', 'login.html');
  });
});
