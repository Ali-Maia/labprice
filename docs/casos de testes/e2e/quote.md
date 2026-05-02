# Casos de Teste Front-end — Módulo de Precificação e Cálculos

Formato: ISO-29119-3

## TC-FE-011
- **Nome:** Calcular orçamento apenas com campos obrigatórios
- **Rastreabilidade:** `quote.html` → `quote.js` → `POST /quote/calculate` → `src/controllers/productController.js` → `src/services/pricingService.js`
- **Objetivo:** Validar cálculo completo com campos obrigatórios.
- **Pré-condições:** Usuário logado.
- **Dados de teste:** gramsUsed: `150`; costPerKg: `45`; powerWatts: `200`; timeHours: `5.5`; tarifaKwh: `0.85`; markupPercentage: `30`.
- **Passos:**
  1. Abrir `quote.html`.
  2. Preencher os campos obrigatórios.
  3. Clicar em **Calcular orçamento**.
- **Ação:** Submeter o formulário de cálculo.
- **Resultado esperado:** A API retorna sucesso e o painel de resultado exibe o preço final e o detalhamento do cálculo.
- **Pós-condições:** Orçamento exibido na tela.

## TC-FE-012
- **Nome:** Calcular orçamento com variáveis opcionais ativas
- **Rastreabilidade:** `quote.html` → `quote.js` → `src/services/pricingService.js`
- **Objetivo:** Validar a exibição e o uso dos campos opcionais.
- **Pré-condições:** Usuário logado.
- **Dados de teste:** depreciação ativa com machineValue: `5000`, lifeHours: `8000`.
- **Passos:**
  1. Abrir `quote.html`.
  2. Marcar a opção de depreciação.
  3. Preencher os dados adicionais.
  4. Calcular.
- **Ação:** Submeter orçamento com taxa opcional.
- **Resultado esperado:** Campos opcionais são considerados no cálculo e o valor de depreciação é maior que zero.
- **Pós-condições:** Resultado exibido com taxa opcional aplicada.

## TC-FE-013
- **Nome:** Omissão de dados após ativar taxa opcional
- **Rastreabilidade:** `quote.html` → `quote.js` → validação do payload → `src/services/pricingService.js`
- **Objetivo:** Garantir bloqueio quando a taxa opcional está ativa sem os campos obrigatórios.
- **Pré-condições:** Usuário logado.
- **Dados de teste:** checkbox de depreciação marcado, campos vazios.
- **Passos:**
  1. Abrir `quote.html`.
  2. Marcar a opção de depreciação.
  3. Deixar os campos da máquina em branco.
  4. Clicar em **Calcular orçamento**.
- **Ação:** Tentar calcular com dados incompletos.
- **Resultado esperado:** O front-end interrompe o envio e exibe mensagem pedindo o preenchimento dos dados da máquina.
- **Pós-condições:** Nenhuma requisição válida deve ser enviada.

## TC-FE-014
- **Nome:** Bloqueio de valores negativos na UI
- **Rastreabilidade:** `quote.html` → atributos HTML `min="0"`
- **Objetivo:** Impedir entrada de números negativos nos campos numéricos.
- **Pré-condições:** Usuário logado.
- **Dados de teste:** valor negativo como `-50` no campo de peso.
- **Passos:**
  1. Abrir `quote.html`.
  2. Tentar inserir valor negativo no campo numérico.
- **Ação:** Digitar valor abaixo de zero.
- **Resultado esperado:** O input bloqueia o valor ou o navegador impede a submissão.
- **Pós-condições:** Campo permanece com valor válido.

## TC-FE-015
- **Nome:** Exibição de custo zero para taxas desativadas
- **Rastreabilidade:** `quote.js` → renderização do resultado
- **Objetivo:** Garantir que taxas desativadas apareçam como zero.
- **Pré-condições:** Usuário logado.
- **Dados de teste:** opcionais desmarcados.
- **Passos:**
  1. Abrir `quote.html`.
  2. Preencher somente os campos obrigatórios.
  3. Calcular orçamento.
- **Ação:** Gerar cálculo sem opcionais.
- **Resultado esperado:** O detalhamento exibe depreciação e risco como `R$ 0,00`.
- **Pós-condições:** Resultado mantido na tela.

## TC-FE-016
- **Nome:** Limpar formulário de cálculo
- **Rastreabilidade:** `quote.html` → interação de limpeza da UI
- **Objetivo:** Validar retorno ao estado inicial do formulário.
- **Pré-condições:** Campos preenchidos.
- **Dados de teste:** formulário com valores informados.
- **Passos:**
  1. Abrir `quote.html`.
  2. Preencher o formulário.
  3. Acionar a ação de limpar, se disponível na interface.
- **Ação:** Limpar os campos do formulário.
- **Resultado esperado:** Todos os inputs retornam ao estado inicial e o painel de resultados é ocultado.
- **Pós-condições:** Nenhum orçamento exibido.

## TC-FE-017
- **Nome:** Cálculo com taxa de plataforma igual a 0%
- **Rastreabilidade:** `quote.html` → `quote.js` → `src/services/pricingService.js`
- **Objetivo:** Validar o cálculo sem acréscimo de taxa de plataforma.
- **Pré-condições:** Usuário logado.
- **Dados de teste:** campos obrigatórios preenchidos; platformFeePercentage: `0`.
- **Passos:**
  1. Abrir `quote.html`.
  2. Preencher os campos obrigatórios.
  3. Informar `0` na taxa de plataforma.
  4. Calcular.
- **Ação:** Executar cálculo com taxa zerada.
- **Resultado esperado:** O preço final corresponde ao custo total mais lucro, sem ajuste adicional de taxa.
- **Pós-condições:** Resultado disponível para salvamento.
