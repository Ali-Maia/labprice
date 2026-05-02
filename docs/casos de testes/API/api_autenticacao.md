# Especificação de Casos de Teste - Domínio de Autenticação (LabPrice API)

Esta suíte de testes cobre a validação de regras de negócio, sanitização de dados e segurança na geração de credenciais de acesso (JWT), conforme especificado nos Épicos 1 e nas Regras de Negócio (RN01, RN02).

---

### **TC-AUTH-001: Cadastro de Administrador com Dados Válidos (Caminho Feliz)**
*   **Rastreabilidade:** Épico 1 > US01 | RF01
*   **Objetivo:** Verificar se a API permite o cadastro de um novo administrador quando todos os dados enviados seguem as regras de validação.
*   **Pré-condições:** O sistema deve estar rodando e o banco de dados em memória inicializado. O e-mail utilizado não deve existir previamente na base de dados.
*   **Dados de Teste (Payload):**
    ```json
    {
      "username": "admin123",
      "email": "admin@macuxi.com",
      "senha": "passwordSegura123"
    }
    ```

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /users/register` com o payload de teste. | A requisição é processada com sucesso. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar o status **201 Created** (ou 200 OK, dependendo da implementação). O corpo deve conter uma mensagem de sucesso (ex: "Usuário cadastrado com sucesso") e o ID do usuário gerado (sem expor a senha). |

*   **Pós-condições:** O novo usuário "admin123" é persistido na base de dados em memória e a senha deve estar armazenada com hash (criptografada).

---

### **TC-AUTH-002: Rejeição de Cadastro - Username com Caracteres Especiais**
*   **Rastreabilidade:** Épico 1 > US01 | RN01
*   **Objetivo:** Garantir que o sistema valide o campo `username` e rejeite inserções contendo caracteres que não sejam alfanuméricos.
*   **Pré-condições:** API operacional.
*   **Dados de Teste (Payload):**
    ```json
    {
      "username": "admin@#$%",
      "email": "teste@macuxi.com",
      "senha": "password123"
    }
    ```

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /users/register` com o payload de teste. | A API deve interceptar o erro na camada de validação. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar o status **400 Bad Request**. O corpo da resposta deve indicar que o campo `username` é inválido e aceita apenas caracteres alfanuméricos. |

*   **Pós-condições:** Nenhum registro novo é criado na base de dados.

---

### **TC-AUTH-003: Rejeição de Cadastro - Sanitização de Senha e Tamanho Mínimo**
*   **Rastreabilidade:** Épico 1 > US01 | RN01
*   **Objetivo:** Validar o comportamento do backend ao receber senhas menores que 6 caracteres após a sanitização (remoção de espaços nas extremidades).
*   **Pré-condições:** API operacional.
*   **Dados de Teste (Payload):**
    ```json
    {
      "username": "admin",
      "email": "teste2@macuxi.com",
      "senha": " 1234  " 
    }
    ```
    *(Nota: A senha possui 7 caracteres no total contando os espaços, mas apenas 4 caracteres úteis).*

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /users/register` com o payload de teste. | A API deve realizar a função `trim()` na senha antes da validação de tamanho. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar o status **400 Bad Request**. A mensagem de erro deve indicar que a senha não cumpre o requisito mínimo de 6 caracteres. |

*   **Pós-condições:** Nenhum registro novo é criado na base de dados.

---

### **TC-AUTH-004: Login de Usuário com Sucesso e Geração de JWT**
*   **Rastreabilidade:** Épico 1 > US02 | RF02, RNF05
*   **Objetivo:** Verificar se o sistema autentica corretamente um usuário válido e gera um token JWT.
*   **Pré-condições:** O usuário `admin@macuxi.com` com a senha `passwordSegura123` deve estar previamente cadastrado no banco de dados.
*   **Dados de Teste (Payload):**
    ```json
    {
      "email": "admin@macuxi.com",
      "senha": "passwordSegura123"
    }
    ```

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /users/login` com as credenciais válidas. | O sistema encontra o usuário e valida o hash da senha com sucesso. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar o status **200 OK**. O corpo da resposta deve conter a propriedade `token` (com uma string JWT válida no formato base64 url-encoded). |

*   **Pós-condições:** Uma sessão de usuário é implicitamente iniciada (token válido gerado) com tempo de expiração definido.

---

### **TC-AUTH-005: Rejeição de Login com Credenciais Inválidas**
*   **Rastreabilidade:** Épico 1 > US02
*   **Objetivo:** Assegurar que o sistema proteja o acesso negando login com senhas incorretas ou e-mails não cadastrados, sem indicar exatamente qual campo falhou (para evitar *user enumeration*).
*   **Pré-condições:** O usuário `admin@macuxi.com` deve estar cadastrado na base com uma senha diferente da utilizada no teste.
*   **Dados de Teste (Payload):**
    ```json
    {
      "email": "admin@macuxi.com",
      "senha": "senhaIncorreta"
    }
    ```

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /users/login` com as credenciais inválidas. | O sistema falha ao comparar a senha informada com o hash armazenado. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar o status **401 Unauthorized**. A mensagem de resposta deve ser genérica (ex: "Credenciais inválidas" ou "E-mail ou senha incorretos"), e nenhum token deve ser retornado. |

*   **Pós-condições:** O acesso permanece negado e nenhum token é emitido.