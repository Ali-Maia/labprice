Cypress.Commands.add('loginByApi', (email, password) => {
  cy.request('POST', '/auth/login', { email, password }).then((response) => {
    expect(response.status).to.eq(200);

    cy.window().then((win) => {
      win.localStorage.setItem('labprice_token', response.body.token);
      win.localStorage.setItem('labprice_user', JSON.stringify(response.body.user));
    });
  });
});

Cypress.Commands.add('loginAsTestUser', () => {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-8);
  const user = {
    username: `cypress${suffix}`,
    email: `cypress${suffix}@labprice.com`,
    password: 'senha123'
  };

  cy.request('POST', '/auth/register', user).then((registerResponse) => {
    expect(registerResponse.status).to.eq(201);
  });

  cy.visit('/login.html');
  cy.loginByApi(user.email, user.password);
});

Cypress.Commands.add('createTestProduct', (name = 'Produto Cypress') => {
  return cy.window().then((win) => {
    const token = win.localStorage.getItem('labprice_token');

    return cy.request('POST', '/quote/calculate', {
      gramsUsed: 150,
      costPerKg: 45,
      powerWatts: 200,
      timeHours: 5.5,
      tarifaKwh: 0.85,
      markupPercentage: 30,
      platformFeePercentage: 0
    }).then((quoteResponse) => cy.request({
      method: 'POST',
      url: '/products',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        name,
        quotationData: quoteResponse.body.quotation
      }
    })).then((productResponse) => {
      expect(productResponse.status).to.eq(201);
      return productResponse.body.product;
    });
  });
});

Cypress.Commands.add('clearSession', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('labprice_token');
    win.localStorage.removeItem('labprice_user');
  });
});
