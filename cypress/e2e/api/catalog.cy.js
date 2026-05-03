describe('API - Catálogo', () => {
  let authToken;
  let produtoId;

  before(() => {
    cy.request('POST', '/auth/register', {
      username: `cataloguser`,
      email: `cataloguser@labprice.com`,
      password: 'senha123'
    });

    cy.request('POST', '/auth/login', {
      email: `cataloguser@labprice.com`,
      password: 'senha123'
    }).then((response) => {
      authToken = response.body.token;
    });
  });

  describe('Testes de Criação de Produto', () => {

    it('TC-PROD-001: Conversão de Orçamento em Produto', function () {
      cy.request({
        method: 'POST',
        url: '/quote/calculate',
        body: {
          gramsUsed: 150,
          costPerKg: 45,
          powerWatts: 200,
          timeHours: 5.5,
          tarifaKwh: 0.85,
          markupPercentage: 30,
          platformFeePercentage: 0
        }
      }).then((quoteResponse) => {
        expect(quoteResponse.status).to.eq(200);

        cy.request({
          method: 'POST',
          url: '/products',
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          body: {
            name: 'Vaso Geométrico 3D',
            quotationData: quoteResponse.body.quotation
          }
        }).then((productResponse) => {
          expect(productResponse.status).to.eq(201);
          expect(productResponse.body).to.have.property('product');
          expect(productResponse.body.product).to.have.property('id');
          expect(productResponse.body.product.name).to.be.eq('Vaso Geométrico 3D');
          produtoId = productResponse.body.product.id;
        });
      });
    });

    it('TC-PROD-002: Rejeição de Criação de Produto Manual Genérico', function () {
      cy.request({
        method: 'POST',
        url: '/products',
        failOnStatusCode: false,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          name: 'Action Figure Batman',
          quotationData: {
            costMaterial: 10,
            costEnergy: 10,
            priceBase: 10,
            profit: 10,
            platformFeePercentage: 0,
            finalPrice: 150,
            markup: 50
          }
        }
      }).then((productResponse) => {
        expect(productResponse.status).to.eq(400);
        expect(productResponse.body.error).to.be.eq('Dados de orçamento inválidos ou incompletos [RN05]');
      });
    });

    it('TC-PROD-003: Proteção de Rota - Tentativa de Criação sem Token', function () {
      cy.request({
        method: 'POST',
        url: '/products',
        failOnStatusCode: false,
        headers: {
          Authorization: `Bearer `
        },
        body: {
          name: 'Action Figure Batman',
          quotationData: {
            costMaterial: 10,
            costEnergy: 10,
            priceBase: 10,
            profit: 10,
            platformFeePercentage: 0,
            finalPrice: 150,
            markup: 50
          }
        }
      }).then((productResponse) => {
        expect(productResponse.status).to.eq(401);
        expect(productResponse.body.error).to.be.eq('Unauthorized');
      });
    });
  });

  describe('Testes de Consulta de Catálogo de Produto', () => {
    it('TC-PROD-004: Consulta de Listagem de Catálogo', function () {
      cy.request({
        method: 'GET',
        url: '/products',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((productResponse) => {
        expect(productResponse.status).to.eq(200);
        expect(productResponse.body.message).to.be.eq('Produtos listados com sucesso [US07]')
      });
    });

    it('TC-PROD-005: Detalhamento de Produto Existente', function () {
      cy.request({
        method: 'GET',
        url: `/products/${produtoId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
      }).then((productResponse) => {
        expect(productResponse.status).to.eq(200);
        expect(productResponse.body.product.id).to.eq(produtoId);
        expect(productResponse.body.product.name).to.eq('Vaso Geométrico 3D');
      });
    });

    it('TC-PROD-006: Detalhamento de Produto Inexistente', function () {
      cy.request({
        method: 'GET',
        url: `/products/3fa85f64-5717-4562-b3fc-2c963f66afa6`,
        failOnStatusCode: false,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
      }).then((productResponse) => {
        expect(productResponse.status).to.eq(404);
        expect(productResponse.body.error).to.eq('Produto não encontrado');
      });
    });
  });

  describe('Testes de Atualização de Produtos do Catálogo', () => {
    it('TC-PROD-007: Atualização de Produto Existente com Dados Válidos', function () {
      cy.request({
        method: 'PUT',
        url: `/products/${produtoId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          name: "Suporte para Planta",
          gramsUsed: 180,
          costPerKg: 50,
          markupPercentage: 35,
          platformFeePercentage: 15
        },
      }).then((productResponse) => {
        expect(productResponse.status).to.eq(200);
        expect(productResponse.body.product.detailedCosts.gramsUsed).to.eq(180);
        expect(productResponse.body.product.detailedCosts.costPerKg).to.eq(50);
        expect(productResponse.body.product.detailedCosts.markupPercentage).to.eq(35);
        expect(productResponse.body.product.platformFeePercentage).to.eq(15);
        expect(productResponse.body.product.costMaterial).to.eq(9);
        expect(productResponse.body.product).to.have.property('updatedAt');
        expect(productResponse.body.product.name).to.eq('Suporte para Planta');
      });
    });

    it('TC-PROD-008: Atualização de Produto Existente com Dados Inválidos', function () {
      cy.request({
        method: 'PUT',
        url: `/products/${produtoId}`,
        failOnStatusCode: false,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          name: "Suporte para Planta",
          gramsUsed: -1,
          costPerKg: 50,
          markupPercentage: 35,
          platformFeePercentage: 15
        },
      }).then((productResponse) => {
        expect(productResponse.status).to.eq(400);
        expect(productResponse.body.error).to.eq('Erro ao atualizar produto');
        expect(productResponse.body.message).to.eq('gramsUsed é obrigatório e deve ser um número positivo');
      });
    });

    it('TC-PROD-009: Atualização de Produto Inexistente', function () {
      cy.request({
        method: 'PUT',
        url: `/products/3fa85f64-5717-4562-b3fc-2c963f66afa6`,
        failOnStatusCode: false,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: {
          name: "Suporte para Planta",
          gramsUsed: 180,
          costPerKg: 50,
          markupPercentage: 35,
          platformFeePercentage: 15
        },
      }).then((productResponse) => {
        expect(productResponse.status).to.eq(404);
        expect(productResponse.body.error).to.eq('Produto não encontrado');
      });
    });
  });

  describe('Testes de Exclusão de Produtos', () => {
    it('TC-PROD-010: Exclusão de Produto Existente', function () {
      cy.request({
        method: 'DELETE',
        url: `/products/${produtoId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((productResponse) => {
        expect(productResponse.status).to.eq(200);
        expect(productResponse.body.message).to.eq('Produto deletado com sucesso [US09]');
      });
    });

    it('TC-PROD-011: Exclusão de Produto Inexistente', function () {
      cy.request({
        method: 'DELETE',
        url: `/products/${produtoId}`,
        failOnStatusCode: false,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((productResponse) => {
        expect(productResponse.status).to.eq(404);
        expect(productResponse.body.error).to.eq('Produto não encontrado');
      });
    });
  });
});