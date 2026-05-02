describe('API - Precificação', () => {
  it('deve calcular um orçamento com sucesso', () => {
    cy.request('POST', '/quote/calculate', {
      gramsUsed: 150,
      costPerKg: 45,
      powerWatts: 200,
      timeHours: 5.5,
      tarifaKwh: 0.85,
      markupPercentage: 30,
      platformFeePercentage: 0
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quotation');
      expect(response.body.quotation).to.have.property('finalPrice');
    });
  });
});
