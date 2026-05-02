# Casos de Teste Front-end — Módulo de Exclusão de Produtos

Formato: ISO-29119-3

## TC-FE-032
- **Nome:** Excluir produto confirmando na listagem
- **Rastreabilidade:** `products.html` → `products.js` → `DELETE /products/:id`
- **Objetivo:** Validar exclusão de um produto a partir da listagem.
- **Pré-condições:** Existem produtos na lista.
- **Dados de teste:** ID válido de um produto.
- **Passos:**
  1. Abrir `products.html`.
  2. Clicar em **Excluir** no item desejado.
  3. Confirmar a exclusão.
- **Ação:** Confirmar a remoção do produto.
- **Resultado esperado:** Item removido do DOM e toast de sucesso exibido.
- **Pós-condições:** Produto removido do backend e da interface.

## TC-FE-033
- **Nome:** Cancelar exclusão no modal
- **Rastreabilidade:** `products.html` → `products.js` → fluxo de confirmação
- **Objetivo:** Garantir que a exclusão não ocorra quando cancelada.
- **Pré-condições:** Produtos na lista.
- **Dados de teste:** ID válido de produto.
- **Passos:**
  1. Abrir `products.html`.
  2. Acionar a exclusão de um item.
  3. Cancelar a confirmação.
- **Ação:** Interromper a exclusão.
- **Resultado esperado:** O produto permanece na tela e nenhuma requisição DELETE é concluída.
- **Pós-condições:** Estado da listagem inalterado.
