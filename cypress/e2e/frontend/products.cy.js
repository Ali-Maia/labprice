describe('Front-end - Catálogo', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
  });

  it('TC-FE-022 e TC-FE-024: deve listar produtos e permitir abrir o detalhe', () => {
    cy.createTestProduct('Produto do Catálogo');
    cy.visit('/products.html');
    cy.contains('#productsList', 'Produto do Catálogo');
    cy.contains('#productsList', 'Final:');
    cy.contains('#productsList', 'Custo:');
    cy.get('#productsList a[href^="product-detail.html?id="]')
      .should('have.attr', 'href')
      .then((href) => {
        cy.visit(`/${href}`);
      });
    cy.contains('Consulta completa do produto');
  });

  it('TC-FE-023: deve exibir o estado vazio quando não houver produtos', () => {
    cy.intercept('GET', '/products', {
      statusCode: 200,
      body: { products: [] }
    }).as('emptyProducts');

    cy.visit('/products.html');
    cy.wait('@emptyProducts');
    cy.contains('#productsList', 'Nenhum produto cadastrado ainda.');
  });

  it('TC-FE-032 e TC-FE-033: deve respeitar a confirmação de exclusão', () => {
    cy.createTestProduct('Produto para Exclusão').then((product) => {
      cy.visit('/products.html');
      cy.contains('#productsList', product.name).should('be.visible');

      cy.window().then((win) => {
        cy.stub(win, 'confirm')
          .onFirstCall().returns(false)
          .onSecondCall().returns(true);
      });
      cy.get(`[data-delete-product="${product.id}"]`).click();
      cy.contains('#productsList', product.name).should('be.visible');

      cy.intercept('DELETE', `/products/${product.id}`).as('deleteProduct');
      cy.get(`[data-delete-product="${product.id}"]`).click();
      cy.wait('@deleteProduct').its('response.statusCode').should('eq', 200);
      cy.get(`[data-delete-product="${product.id}"]`).should('not.exist');
    });
  });
});
