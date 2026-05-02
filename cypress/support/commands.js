Cypress.Commands.add('loginByApi', (email, password) => {
  cy.request('POST', '/auth/login', { email, password }).then((response) => {
    expect(response.status).to.eq(200);

    cy.window().then((win) => {
      win.localStorage.setItem('labprice_token', response.body.token);
      win.localStorage.setItem('labprice_user', JSON.stringify(response.body.user));
    });
  });
});

Cypress.Commands.add('clearSession', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('labprice_token');
    win.localStorage.removeItem('labprice_user');
  });
});
