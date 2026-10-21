describe('Front-end - Detalhe do produto', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
  });

  it('TC-FE-022: deve exibir os dados completos de um produto', () => {
    cy.createTestProduct('Produto em Detalhe').then((product) => {
      cy.visit(`/product-detail.html?id=${product.id}`);
      cy.contains('Consulta completa do produto');
      cy.contains('#productDetail', product.name);
      cy.contains('#productDetail', 'Resumo financeiro');
      cy.contains('#productDetail', 'Dados do orçamento');
      cy.contains('#productDetail', 'Gramas usadas: 150');
      cy.get('#productDetail a[href^="product-edit.html?id="]').should('be.visible');
    });
  });

  it('TC-FE-025: deve exibir erro ao consultar produto inexistente', () => {
    cy.visit('/product-detail.html?id=3fa85f64-5717-4562-b3fc-2c963f66afa6');
    cy.contains('#productDetail', 'Produto não encontrado');
  });
});
