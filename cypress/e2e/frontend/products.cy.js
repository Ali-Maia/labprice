describe('Front-end - Catálogo', () => {
  it('deve abrir a página de produtos', () => {
    cy.visit('/products.html');
    cy.contains('Catálogo de produtos');
    cy.get('#productsList').should('be.visible');
  });
});
