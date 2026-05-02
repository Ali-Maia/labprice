describe('API - Catálogo', () => {
  const tokenAlias = 'labpriceToken';

  before(() => {
    const suffix = Date.now();
    cy.request('POST', '/auth/register', {
      username: `cataloguser${suffix}`,
      email: `cataloguser${suffix}@labprice.com`,
      password: 'senha123'
    });

    cy.request('POST', '/auth/login', {
      email: `cataloguser${suffix}@labprice.com`,
      password: 'senha123'
    }).then((response) => {
      cy.wrap(response.body.token).as(tokenAlias);
    });
  });

  it('deve calcular e salvar um produto no catálogo', function () {
    cy.get(`@${tokenAlias}`).then((token) => {
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
            Authorization: `Bearer ${token}`
          },
          body: {
            name: 'Produto Cypress',
            quotationData: quoteResponse.body.quotation
          }
        }).then((productResponse) => {
          expect(productResponse.status).to.eq(201);
          expect(productResponse.body).to.have.property('product');
        });
      });
    });
  });
});
