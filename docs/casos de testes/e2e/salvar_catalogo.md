# Casos de Teste Front-end — Módulo de Salvamento de Catálogo

Formato: ISO-29119-3

## TC-FE-018
- **Nome:** Salvar produto validado no estoque
- **Rastreabilidade:** `quote.html` → `quote.js` → `POST /products` → `src/controllers/productController.js`
- **Objetivo:** Validar a persistência de um orçamento já calculado.
- **Pré-condições:** Orçamento calculado na tela atual.
- **Dados de teste:** nome do produto: `Vaso 3D`.
- **Passos:**
  1. Calcular um orçamento em `quote.html`.
  2. Informar o nome do produto.
  3. Clicar em **Salvar como produto**.
- **Ação:** Enviar o orçamento calculado para criação do produto.
- **Resultado esperado:** Toast de sucesso e redirecionamento ou atualização para o catálogo.
- **Pós-condições:** Produto criado no backend.

## TC-FE-019
- **Nome:** Tentativa de salvamento sem nome do produto
- **Rastreabilidade:** `quote.js` → validação do campo `productName`
- **Objetivo:** Impedir criação de produto sem nome.
- **Pré-condições:** Orçamento já calculado.
- **Dados de teste:** campo nome vazio.
- **Passos:**
  1. Calcular um orçamento.
  2. Deixar o nome do produto em branco.
  3. Clicar em **Salvar como produto**.
- **Ação:** Tentar salvar sem preencher o nome.
- **Resultado esperado:** O front impede a ação e exibe mensagem solicitando o nome do produto.
- **Pós-condições:** Nenhuma requisição de criação válida deve ocorrer.

## TC-FE-020
- **Nome:** Tentativa de salvar sem cálculo prévio
- **Rastreabilidade:** `quote.js` → estado de `saveQuoteSection`
- **Objetivo:** Garantir que o botão de salvar dependa do cálculo.
- **Pré-condições:** Página aberta sem orçamento calculado.
- **Dados de teste:** nome preenchido, sem cálculo.
- **Passos:**
  1. Abrir `quote.html`.
  2. Preencher o nome do produto.
  3. Tentar acionar a ação de salvar.
- **Ação:** Executar salvamento sem orçamento.
- **Resultado esperado:** A interface bloqueia a ação e solicita o cálculo prévio.
- **Pós-condições:** Nenhum produto é salvo.

## TC-FE-021
- **Nome:** Sessão expirada ao salvar
- **Rastreabilidade:** `quote.js` → `apiRequest()` → `authMiddleware`
- **Objetivo:** Validar tratamento de expiração de token durante o salvamento.
- **Pré-condições:** Orçamento calculado; JWT expirado ou removido.
- **Dados de teste:** token inválido/expirado.
- **Passos:**
  1. Calcular um orçamento.
  2. Expirar ou remover o token.
  3. Tentar salvar o produto.
- **Ação:** Enviar requisição autenticada com token inválido.
- **Resultado esperado:** O front exibe mensagem de sessão expirada e redireciona ao login.
- **Pós-condições:** Sessão encerrada no navegador.
