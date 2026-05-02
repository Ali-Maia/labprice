# Casos de Teste Front-end — Módulo de Visualização

Formato: ISO-29119-3

## TC-FE-022
- **Nome:** Renderização correta da lista de produtos
- **Rastreabilidade:** `products.html` → `products.js` → `GET /products`
- **Objetivo:** Validar a apresentação da lista com dados existentes.
- **Pré-condições:** Existência de produtos salvos.
- **Dados de teste:** produtos retornados pela API.
- **Passos:**
  1. Abrir `products.html`.
  2. Aguardar o carregamento dos dados.
- **Ação:** Exibir a lista de produtos.
- **Resultado esperado:** Cards ou lista renderizados com nome, preço final e ações.
- **Pós-condições:** Lista disponível para interação.

## TC-FE-023
- **Nome:** Tratamento de lista vazia
- **Rastreabilidade:** `products.js` → empty state da listagem
- **Objetivo:** Verificar a mensagem quando não houver itens cadastrados.
- **Pré-condições:** Nenhum produto salvo.
- **Dados de teste:** lista vazia retornada pela API.
- **Passos:**
  1. Abrir `products.html`.
  2. Aguardar o carregamento.
- **Ação:** Renderizar a listagem sem dados.
- **Resultado esperado:** Exibição de mensagem de estado vazio com opção para criar orçamento.
- **Pós-condições:** Nenhuma lista falsa deve aparecer.

## TC-FE-024
- **Nome:** Navegação para detalhamento do produto
- **Rastreabilidade:** `products.html` → `products.js` → `product-detail.html`
- **Objetivo:** Validar navegação até o detalhe de um item.
- **Pré-condições:** Produtos na lista.
- **Dados de teste:** ID válido de um produto.
- **Passos:**
  1. Abrir `products.html`.
  2. Clicar em **Detalhar** em um item.
- **Ação:** Seguir para a página de detalhe.
- **Resultado esperado:** Redirecionamento para `product-detail.html?id=X` com carregamento dos dados.
- **Pós-condições:** Página de detalhe aberta.

## TC-FE-025
- **Nome:** Exibição de erro em produto inexistente
- **Rastreabilidade:** `product-detail.html` → `products.js` → `GET /products/:id`
- **Objetivo:** Validar tratamento de ID inexistente.
- **Pré-condições:** Página de detalhe acessível.
- **Dados de teste:** ID inválido, por exemplo `9999`.
- **Passos:**
  1. Abrir manualmente `product-detail.html?id=9999`.
  2. Aguardar a requisição.
- **Ação:** Solicitar um produto inexistente.
- **Resultado esperado:** Exibição de mensagem `Produto não encontrado` e opção de voltar.
- **Pós-condições:** Erro apresentado sem quebrar a interface.

## TC-FE-026
- **Nome:** Visualização do dashboard resumo
- **Rastreabilidade:** `dashboard.html` → `dashboard.js` → `GET /products` e `GET /users`
- **Objetivo:** Validar a renderização dos indicadores do painel.
- **Pré-condições:** Acesso logado.
- **Dados de teste:** dados de produtos e usuários retornados pela API.
- **Passos:**
  1. Abrir `dashboard.html`.
  2. Aguardar os dados do painel.
- **Ação:** Renderizar widgets do dashboard.
- **Resultado esperado:** Widgets numéricos exibidos dinamicamente sem quebra de layout.
- **Pós-condições:** Dashboard disponível para uso.
