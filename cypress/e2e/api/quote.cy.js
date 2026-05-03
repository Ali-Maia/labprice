describe('API - Precificação', () => {
  it('TC-CALC-001: Cálculo de Orçamento Base com Sucesso, Apenas Dados Obrigatórios)', () => {
    const produto = {
      gramsUsed: 100,
      costPerKg: 100,
      powerWatts: 200,
      timeHours: 5,
      tarifaKwh: 1.0,
      markupPercentage: 50,
      platformFeePercentage: 0
    }

    cy.request('POST', '/quote/calculate', produto).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quotation');
      expect(response.body.quotation.costMaterial).to.eq(10.00);
      expect(response.body.quotation.totalProductionCost).to.eq(11.00);
      expect(response.body.quotation.profit).to.eq(5.50);
      expect(response.body.quotation.finalPrice).to.eq(16.50);
      expect(response.body.quotation.depreciation).to.eq(0);
      expect(response.body.quotation.riskTax).to.eq(0);
    });
  });

  it('TC-CALC-002: Cálculo Completo com Taxas Opcionais e Plataforma', () => {
    const produto = {
      "gramsUsed": 100,
      "costPerKg": 100,
      "powerWatts": 200,
      "timeHours": 5,
      "tarifaKwh": 1,
      "markupPercentage": 50,
      "depreciation": {
        "enabled": true,
        "machineValue": 2000,
        "lifeHours": 2000
      },
      "riskTax": {
        "enabled": true,
        "failurePercentage": 10
      },
      "postProcessing": {
        "timeHours": 1,
        "hourlyRate": 10
      },
      "platformFeePercentage": 10
    }

    cy.request('POST', '/quote/calculate', produto).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quotation');
      expect(response.body.quotation.costMaterial).to.eq(10.00);
      expect(response.body.quotation.depreciation).to.eq(5.0);
      expect(response.body.quotation.riskTax).to.eq(1.60);
      expect(response.body.quotation.postProcessing).to.eq(10.0);
      expect(response.body.quotation.totalProductionCost).to.eq(27.60);
      expect(response.body.quotation.profit).to.eq(13.80);
      expect(response.body.quotation.finalPrice).to.eq(46.0);
    });
  });
  
  it('TC-CALC-003: Rejeição por Variáveis Opcionais Incompletas', () => {
    const produto = {
      "gramsUsed": 100,
      "costPerKg": 100,
      "powerWatts": 200,
      "timeHours": 5,
      "tarifaKwh": 1,
      "markupPercentage": 50,
      "depreciation": {
        "enabled": true
      }
    }

    cy.request({
      method:'POST', 
      url: '/quote/calculate',
      failOnStatusCode: false , 
      body: produto

    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.message).to.eq('Se depreciação está ativada, machineValue e lifeHours são obrigatórios');
    });
  });

  it('TC-CALC-004: Rejeição por Ausência de Parâmetros Obrigatórios', () => {
    const produto = {
      "costPerKg": 100,
      "powerWatts": 200,
      "timeHours": 5,
      "tarifaKwh": 1,
      "markupPercentage": 50,
    }

    cy.request({
      method:'POST', 
      url: '/quote/calculate',
      failOnStatusCode: false , 
      body: produto

    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.message).to.eq('gramsUsed é obrigatório e deve ser um número positivo');
    });
  });

    it('TC-CALC-005: Rejeição de Valores Negativos ou Inválidos', () => {
    const produto = {
      "gramsUsed": 100,
      "costPerKg": 100,
      "powerWatts": 200,
      "timeHours": -1,
      "tarifaKwh": 1,
      "markupPercentage": 50,
    }

    cy.request({
      method:'POST', 
      url: '/quote/calculate',
      failOnStatusCode: false , 
      body: produto

    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.message).to.eq('timeHours é obrigatório e deve ser um número positivo');
    });
  });

});
