describe('Front-end - Dashboard', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
  });

  it('TC-FE-026: deve exibir os indicadores e atalhos do dashboard', () => {
    cy.createTestProduct('Produto do Dashboard');
    cy.visit('/dashboard.html');
    cy.get('#dashboardContent .kpi').should('be.visible');
    cy.get('#dashboardContent .kpi .box').should('have.length', 3);
    cy.contains('#dashboardContent', 'Produtos');
    cy.contains('#dashboardContent', 'Usuários');
    cy.contains('#dashboardContent', 'Online');
    cy.contains('#dashboardContent', 'Produto do Dashboard');
    cy.get('a[href="quote.html"]').should('be.visible');
    cy.get('a[href="products.html"]').should('be.visible');
    cy.get('#dashboardGreeting').should('be.visible');
  });
});
