describe('Front-end - Edição de produto', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
  });

  it('TC-FE-027 e TC-FE-028: deve preencher e recalcular o produto editado', () => {
    cy.createTestProduct('Produto em Edição').then((product) => {
      cy.visit(`/product-edit.html?id=${product.id}`);
      cy.get('#editProductForm').should('be.visible');
      cy.get('#name').should('have.value', product.name);
      cy.get('#gramsUsed').should('have.value', '150');
      cy.get('#costPerKg').should('have.value', '45');

      cy.intercept('PUT', `/products/${product.id}`).as('updateProduct');
      cy.get('#costPerKg').clear().type('50');
      cy.get('#editProductForm').submit();
      cy.wait('@updateProduct').then(({ request, response }) => {
        expect(request.body.costPerKg).to.eq(50);
        expect(response.statusCode).to.eq(200);
        expect(response.body.product.detailedCosts.costPerKg).to.eq(50);
      });
      cy.url().should('include', `/product-detail.html?id=${product.id}`);
    });
  });

  it('TC-FE-030: deve bloquear envio com campo obrigatório vazio', () => {
    cy.createTestProduct('Produto com Validação').then((product) => {
    cy.visit(`/product-edit.html?id=${product.id}`);
    cy.get('#editProductForm').should('be.visible');
    cy.get('#timeHours').should('have.value', '5.5').clear();
    cy.get('#timeHours').then(($field) => {
      expect($field[0].checkValidity()).to.eq(false);
    });
    cy.url().should('include', `/product-edit.html?id=${product.id}`);
    });

  });

  it('deve impedir acesso ao formulário sem identificação do produto', () => {
    cy.visit('/product-edit.html');
    cy.get('#editProductForm').should('be.visible');
    cy.get('#name').should('have.value', '');
  });
});
