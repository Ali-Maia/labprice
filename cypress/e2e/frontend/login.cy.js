describe('Front-end - Login', () => {
  it('deve abrir a tela de login', () => {
    cy.visit('/login.html');
    cy.contains('Entrar');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
  });
});
