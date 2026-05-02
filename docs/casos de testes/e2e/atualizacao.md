# Casos de Teste Front-end — Módulo de Atualização de Produtos

Formato: ISO-29119-3

## TC-FE-027
- **Nome:** Preenchimento automático do formulário de edição
- **Rastreabilidade:** `product-edit.html` → `products.js` → `GET /products/:id`
- **Objetivo:** Validar o carregamento automático dos dados do produto.
- **Pré-condições:** Acesso por um item existente.
- **Dados de teste:** ID válido de produto.
- **Passos:**
  1. Abrir `product-edit.html?id=1` ou outro ID válido.
  2. Aguardar o carregamento.
- **Ação:** Carregar os dados no formulário.
- **Resultado esperado:** Campos preenchidos automaticamente com os valores atuais do produto.
- **Pós-condições:** Formulário pronto para edição.

## TC-FE-028
- **Nome:** Atualizar parâmetro e confirmar recálculo
- **Rastreabilidade:** `product-edit.html` → `products.js` → `PUT /products/:id` → `src/services/pricingService.js`
- **Objetivo:** Validar o recálculo após alteração de custo.
- **Pré-condições:** Formulário preenchido.
- **Dados de teste:** alteração de `costPerKg`.
- **Passos:**
  1. Abrir o formulário de edição.
  2. Alterar o valor de custo por kg.
  3. Clicar em **Salvar alterações**.
- **Ação:** Enviar atualização com parâmetro alterado.
- **Resultado esperado:** Toast de sucesso e preço atualizado na interface.
- **Pós-condições:** Produto persistido com novos valores.

## TC-FE-029
- **Nome:** Adicionar taxa opcional em produto sem taxa
- **Rastreabilidade:** `product-edit.html` → `products.js` → `PUT /products/:id`
- **Objetivo:** Verificar inclusão de taxa opcional e recálculo do preço final.
- **Pré-condições:** Formulário preenchido.
- **Dados de teste:** taxa de falha de `10%`.
- **Passos:**
  1. Abrir a edição do produto.
  2. Marcar a opção de taxa de risco.
  3. Informar `10` no percentual.
  4. Salvar.
- **Ação:** Atualizar o produto com nova taxa opcional.
- **Resultado esperado:** A API recalcula e o novo preço final é exibido como maior.
- **Pós-condições:** Produto atualizado.

## TC-FE-030
- **Nome:** Apagar valor obrigatório durante edição
- **Rastreabilidade:** `product-edit.html` → validação do formulário → `products.js`
- **Objetivo:** Garantir bloqueio de atualização com campo obrigatório vazio.
- **Pré-condições:** Formulário carregado.
- **Dados de teste:** campo `timeHours` vazio.
- **Passos:**
  1. Abrir o formulário de edição.
  2. Limpar o campo de tempo.
  3. Clicar em **Salvar alterações**.
- **Ação:** Tentar submeter sem um campo obrigatório.
- **Resultado esperado:** O front bloqueia o envio e aponta erro de campo obrigatório.
- **Pós-condições:** Nenhuma atualização enviada.

## TC-FE-031
- **Nome:** Cancelar edição e voltar
- **Rastreabilidade:** `product-edit.html` → navegação de retorno
- **Objetivo:** Validar retorno sem atualização.
- **Pré-condições:** Editando um produto.
- **Dados de teste:** alterações não salvas.
- **Passos:**
  1. Abrir a tela de edição.
  2. Alterar campos.
  3. Usar a navegação de retorno para `products.html`.
- **Ação:** Cancelar a edição.
- **Resultado esperado:** Nenhuma chamada `PUT` é realizada e o usuário volta ao catálogo.
- **Pós-condições:** Dados não alterados no backend.
