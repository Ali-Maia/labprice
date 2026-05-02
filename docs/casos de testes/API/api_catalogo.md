# Especificação de Casos de Teste - Domínio de Gestão de Catálogo (LabPrice API)

Esta suíte de testes cobre as operações de CRUD (Create, Read, Update, Delete) para os produtos do catálogo (Épico 3). O foco está em garantir a segurança das rotas (RN02), a integridade na geração de produtos baseados em orçamentos prévios (RN03, RN05) e o recálculo automático em atualizações (RN06).

---

### **TC-PROD-001: Conversão de Orçamento em Produto (Caminho Feliz)**
*   **Rastreabilidade:** Épico 3 > US06 | RN02, RN05, RF05
*   **Objetivo:** Verificar se a API permite salvar um orçamento recém-calculado como um produto oficial no catálogo, desde que o usuário esteja autenticado e o payload contenha o histórico completo.
*   **Pré-condições:** O administrador deve estar autenticado e possuir um token JWT válido.
*   **Dados de Teste:**
    *   *Headers:* `Authorization: Bearer <token_valido>`
    *   *Payload:* `{ "nome_produto": "Vaso Geométrico 3D", "detalhamento_custos": { "custo_material": 10.00, "custo_energia": 1.00, "custo_producao": 11.00, "lucro": 5.50, "preco_final_venda": 16.50 }, "parametros_entrada": { "peso_g": 100, "custo_kg": 100, ... } }`

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /products` com o payload de teste. | A requisição é processada e salva em memória. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar status **201 Created**. A resposta deve conter o ID gerado para o produto e o objeto completo salvo. |

*   **Pós-condições:** O produto "Vaso Geométrico 3D" é persistido no banco de dados em memória e está disponível para consulta.

---

### **TC-PROD-002: Rejeição de Criação de Produto Manual Genérico (Caminho Triste)**
*   **Rastreabilidade:** Épico 3 > US06 | RN03, RN05
*   **Objetivo:** Garantir que o sistema bloqueie a criação de produtos contendo apenas valores arbitrários informados pelo usuário, exigindo a estrutura validada pelo motor de cálculo.
*   **Pré-condições:** Administrador autenticado (Token JWT válido).
*   **Dados de Teste:**
    *   *Headers:* `Authorization: Bearer <token_valido>`
    *   *Payload Inválido:* `{ "nome_produto": "Action Figure Batman", "preco_final_venda": 150.00 }` *(Faltam os detalhamentos de custos e parâmetros)*.

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /products` com o payload incompleto. | O sistema valida a ausência do histórico/detalhamento obrigatório. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar **400 Bad Request**. A mensagem deve explicitar que o produto não pode ser criado fora do fluxo do motor de cálculo (ausência da estrutura de custos). |

---

### **TC-PROD-003: Proteção de Rota - Tentativa de Criação sem Token (Caminho Triste)**
*   **Rastreabilidade:** Épico 1 > US03 / Épico 3 > US06 | RN02
*   **Objetivo:** Confirmar que endpoints do catálogo não podem ser acessados por usuários não autenticados.
*   **Pré-condições:** Nenhuma sessão ativa.
*   **Dados de Teste:** Payload válido do `TC-PROD-001`, mas **sem** o header `Authorization`.

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /products` sem o token JWT. | O middleware de autenticação intercepta a requisição. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar **401 Unauthorized** (ou 403 Forbidden). O produto não é criado. |

---

### **TC-PROD-004: Consulta de Listagem de Catálogo (Caminho Feliz)**
*   **Rastreabilidade:** Épico 3 > US07 | RF06
*   **Objetivo:** Validar o retorno da lista de produtos cadastrados.
*   **Pré-condições:** Administrador autenticado. Pelo menos 2 produtos cadastrados previamente na base.
*   **Dados de Teste:** *Headers:* `Authorization: Bearer <token_valido>`

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `GET /products`. | A API consulta o banco em memória. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar **200 OK**. O corpo deve ser um array JSON contendo o resumo dos produtos cadastrados (ID, Nome e Preço Final). |

---

### **TC-PROD-005: Detalhamento de Produto Inexistente (Caminho Triste)**
*   **Rastreabilidade:** Épico 3 > US07 | RF07
*   **Objetivo:** Validar o comportamento da API ao buscar por um ID que não existe no estoque.
*   **Pré-condições:** Administrador autenticado. O banco não contém o ID fornecido.
*   **Dados de Teste:** ID `9999` (Inexistente).

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `GET /products/9999`. | A API busca o registro e não o encontra. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar **404 Not Found**. A mensagem deve informar "Produto não encontrado". |

---

### **TC-PROD-006: Atualização e Recálculo Automático de Parâmetro (Caminho Feliz)**
*   **Rastreabilidade:** Épico 3 > US08 | RN06
*   **Objetivo:** Confirmar que ao alterar uma variável primária do produto (ex: custo do quilo do material), a API utiliza a camada de *Service* para recalcular todo o objeto antes de salvar.
*   **Pré-condições:** Administrador autenticado. Produto ID `1` existente com `custo_kg` = 100 e `preco_final_venda` = 16.50.
*   **Dados de Teste:**
    *   *Headers:* `Authorization: Bearer <token_valido>`
    *   *Payload:* `{ "parametros_entrada": { "custo_kg": 200 } }` *(dobrando o custo do material)*.

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `PUT /products/1` com o payload de teste. | A API invoca o motor de precificação e atualiza o objeto em memória. |
| 2 | Verificar o status da resposta. | A API deve retornar **200 OK**. |
| 3 | Validar o corpo da resposta. | O objeto retornado deve exibir os novos cálculos baseados no `custo_kg` de 200. O `custo_material` deve ter subido de R$ 10,00 para R$ 20,00, e o `preco_final_venda` deve refletir o aumento total mantendo o markup. |

---

### **TC-PROD-007: Exclusão de Produto Existente (Caminho Feliz)**
*   **Rastreabilidade:** Épico 3 > US09 | RF06
*   **Objetivo:** Validar se a API remove corretamente um produto do catálogo.
*   **Pré-condições:** Administrador autenticado. Produto ID `2` existe no banco.
*   **Dados de Teste:** *Headers:* `Authorization: Bearer <token_valido>`

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `DELETE /products/2`. | A API remove o registro do array em memória. |
| 2 | Verificar o status da resposta. | A API deve retornar **204 No Content** (ou **200 OK** com mensagem de sucesso). |
| 3 | Tentar buscar o produto deletado (`GET /products/2`). | A API deve retornar **404 Not Found**. |