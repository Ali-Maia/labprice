describe('Front-end - Dashboard', () => {
  it('deve abrir o dashboard', () => {
    cy.visit('/dashboard.html');
    cy.contains('Painel operacional');
    cy.get('#dashboardGreeting').should('be.visible');
  });
});
