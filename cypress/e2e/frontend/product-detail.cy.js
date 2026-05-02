describe('Front-end - Detalhe do produto', () => {
  it('deve abrir a página de detalhe do produto', () => {
    cy.visit('/product-detail.html');
    cy.contains('Consulta completa do produto');
    cy.get('#productDetail').should('be.visible');
  });
});
