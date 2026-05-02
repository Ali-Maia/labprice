const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LabPrice API - Precificação 3D',
      version: '1.0.0',
      description: 'API RESTful para cálculo de orçamentos e gestão de catálogo de impressão 3D',
      contact: {
        name: 'Alícia Maia',
        url: 'https://github.com/Ali-Maia/labprice'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            username: {
              type: 'string',
              description: 'Nome de usuário (alfanumérico)'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            token: {
              type: 'string',
              description: 'JWT token para autenticação'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Quotation: {
          type: 'object',
          properties: {
            costMaterial: {
              type: 'number',
              format: 'float',
              description: 'Custo de material em R$'
            },
            costEnergy: {
              type: 'number',
              format: 'float',
              description: 'Custo de energia em R$'
            },
            depreciation: {
              type: 'number',
              format: 'float',
              description: 'Depreciação da máquina em R$'
            },
            priceBase: {
              type: 'number',
              format: 'float',
              description: 'Preço base antes de taxas'
            },
            riskTax: {
              type: 'number',
              format: 'float',
              description: 'Taxa de risco/falha em R$'
            },
            postProcessing: {
              type: 'number',
              format: 'float',
              description: 'Custo de pós-processamento em R$'
            },
            additionalCosts: {
              type: 'number',
              format: 'float',
              description: 'Custos adicionais em R$'
            },
            packaging: {
              type: 'number',
              format: 'float',
              description: 'Custo de embalagem em R$'
            },
            totalProductionCost: {
              type: 'number',
              format: 'float',
              description: 'Custo total de produção em R$'
            },
            profit: {
              type: 'number',
              format: 'float',
              description: 'Lucro bruto em R$'
            },
            platformFeePercentage: {
              type: 'number',
              format: 'float',
              description: 'Percentual de taxa de plataforma/envio'
            },
            finalPrice: {
              type: 'number',
              format: 'float',
              description: 'Preço final de venda em R$'
            },
            markup: {
              type: 'number',
              format: 'float',
              description: 'Percentual de markup aplicado'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              description: 'Nome do produto'
            },
            costMaterial: {
              type: 'number',
              format: 'float'
            },
            costEnergy: {
              type: 'number',
              format: 'float'
            },
            depreciation: {
              type: 'number',
              format: 'float'
            },
            riskTax: {
              type: 'number',
              format: 'float'
            },
            postProcessing: {
              type: 'number',
              format: 'float'
            },
            totalProductionCost: {
              type: 'number',
              format: 'float'
            },
            profit: {
              type: 'number',
              format: 'float'
            },
            finalPrice: {
              type: 'number',
              format: 'float'
            },
            platformFeePercentage: {
              type: 'number',
              format: 'float'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string'
            },
            message: {
              type: 'string'
            },
            details: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/swagger/endpoints.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
