describe('Front-end - Edição de produto', () => {
  it('deve abrir a página de edição do produto', () => {
    cy.visit('/product-edit.html');
    cy.contains('Atualize nome e custos da peça');
    cy.get('#editProductForm').should('be.visible');
  });
});
