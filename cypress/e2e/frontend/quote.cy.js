describe('Front-end - Orçamento', () => {
  it('deve abrir a página de orçamento', () => {
    cy.visit('/quote.html');
    cy.contains('Monte o orçamento');
    cy.get('#quoteForm').should('be.visible');
  });
});
