/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Autenticação (US01)
 *     summary: Cadastro de Administrador
 *     description: Cria um novo usuário no sistema. Username deve conter apenas caracteres alfanuméricos [RN01]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: '^[a-zA-Z0-9]+$'
 *                 example: "admin123"
 *                 description: Alfanumérico apenas [RN01]
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@labprice.com"
 *                 description: Email válido [RN01]
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "senha123"
 *                 description: Mínimo 6 caracteres [RN01]
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos ou username/email já em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticação (US02)
 *     summary: Login e Geração de Token
 *     description: Autentica usuário e retorna token JWT com expiração de 7 dias [RF02]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@labprice.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Autenticação (US03)
 *     summary: Consulta Segura de Usuários
 *     description: Lista todos os usuários cadastrados. Requer autenticação JWT [RN02]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários recuperada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /quote/calculate:
 *   post:
 *     tags:
 *       - Motor de Precificação (US04, US05)
 *     summary: Cálculo de Orçamento Base com Taxas Opcionais
 *     description: |
 *       Calcula orçamento completo com aplicação de taxas opcionais.
 *       Retorna detalhamento sem salvar no banco de dados [US04].
 *       Suporta depreciação, risco e taxa de plataforma [US05].
 *       Não persistente em memória - apenas para cálculo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gramsUsed
 *               - costPerKg
 *               - powerWatts
 *               - timeHours
 *               - tarifaKwh
 *               - markupPercentage
 *             properties:
 *               gramsUsed:
 *                 type: number
 *                 format: float
 *                 example: 150
 *                 description: Gramas de filamento usadas
 *               costPerKg:
 *                 type: number
 *                 format: float
 *                 example: 45.00
 *                 description: Custo por Kg do filamento
 *               powerWatts:
 *                 type: number
 *                 format: float
 *                 example: 200
 *                 description: Potência da máquina em watts
 *               timeHours:
 *                 type: number
 *                 format: float
 *                 example: 5.5
 *                 description: Tempo de impressão em horas
 *               tarifaKwh:
 *                 type: number
 *                 format: float
 *                 example: 0.85
 *                 description: Tarifa de energia por kWh
 *               markupPercentage:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 30
 *                 description: Percentual de margem desejada
 *               depreciation:
 *                 type: object
 *                 nullable: true
 *                 description: "Depreciação de máquina [RN03] - Padrão: desativada"
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *                     example: true
 *                   machineValue:
 *                     type: number
 *                     format: float
 *                     example: 5000
 *                   lifeHours:
 *                     type: number
 *                     format: float
 *                     example: 8000
 *               riskTax:
 *                 type: object
 *                 nullable: true
 *                 description: "Taxa de risco/falha [RN03] - Padrão: desativada"
 *                 properties:
 *                   enabled:
 *                     type: boolean
 *                     example: true
 *                   failurePercentage:
 *                     type: number
 *                     format: float
 *                     minimum: 0
 *                     maximum: 100
 *                     example: 5
 *               postProcessing:
 *                 type: object
 *                 nullable: true
 *                 description: Pós-processamento - Opcional
 *                 properties:
 *                   timeHours:
 *                     type: number
 *                     format: float
 *                     example: 2
 *                   hourlyRate:
 *                     type: number
 *                     format: float
 *                     example: 50
 *               additionalCosts:
 *                 type: number
 *                 format: float
 *                 example: 10
 *                 description: Custos adicionais - Opcional
 *               packaging:
 *                 type: number
 *                 format: float
 *                 example: 5
 *                 description: Custo de embalagem - Opcional
 *               platformFeePercentage:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 99
 *                 example: 15
 *                 description: "Taxa de plataforma/envio em % [RN04] - Opcional"
 *     responses:
 *       200:
 *         description: Orçamento calculado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 quotation:
 *                   $ref: '#/components/schemas/Quotation'
 *       400:
 *         description: Dados inválidos ou campos obrigatórios faltando
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Catálogo de Produtos (US06)
 *     summary: Conversão de Orçamento em Produto
 *     description: |
 *       Converte um orçamento recém-calculado em produto persistido.
 *       O payload deve conter o detalhamento do cálculo e nome do produto [RN05].
 *       Requer autenticação JWT.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quotationData
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Suporte para Planta Pequena"
 *                 description: Nome do produto [RN05]
 *               quotationData:
 *                 $ref: '#/components/schemas/Quotation'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados de orçamento inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     tags:
 *       - Catálogo de Produtos (US07)
 *     summary: Listar Produtos
 *     description: Lista todos os produtos com resumo de informações. Requer autenticação JWT [US07]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos recuperada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Catálogo de Produtos (US07)
 *     summary: Detalhamento de Produto
 *     description: Retorna detalhes completos do produto com quebra de custos [US07, RF07]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Detalhes do produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     tags:
 *       - Catálogo de Produtos (US08)
 *     summary: Atualizar Parâmetros de Custo
 *     description: |
 *       Atualiza variáveis de custo e recalcula automaticamente o preço final [RN06].
 *       Qualquer mudança em variáveis de entrada aciona o motor de precificação.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Suporte para Planta - Versão 2"
 *               gramsUsed:
 *                 type: number
 *                 format: float
 *                 example: 180
 *               costPerKg:
 *                 type: number
 *                 format: float
 *                 example: 50.00
 *               markupPercentage:
 *                 type: number
 *                 format: float
 *                 example: 35
 *               platformFeePercentage:
 *                 type: number
 *                 format: float
 *                 example: 15
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Catálogo de Produtos (US09)
 *     summary: Excluir Produto
 *     description: Remove um produto do catálogo. Requer autenticação JWT [RF06]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
