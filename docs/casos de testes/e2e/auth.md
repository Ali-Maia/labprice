# Casos de Teste Front-end — Módulo de Autenticação e Sessão

Formato: ISO-29119-3

## TC-FE-001
- **Nome:** Registro com sucesso na página `register.html`
- **Rastreabilidade:** `auth.js` → `POST /auth/register` → `src/controllers/authController.js`
- **Objetivo:** Validar o fluxo de cadastro com dados válidos.
- **Pré-condições:** Nenhuma.
- **Dados de teste:** username: `admin123`; email: `admin@labprice.com`; senha: `senha123`
- **Passos:**
  1. Acessar `register.html`.
  2. Preencher os campos com dados válidos.
  3. Clicar em **Cadastrar**.
- **Ação:** Submeter o formulário de cadastro.
- **Resultado esperado:** Exibir toast de sucesso e redirecionar para `login.html`.
- **Pós-condições:** Usuário criado; nenhum token deve estar armazenado.

## TC-FE-002
- **Nome:** Bloqueio de caracteres especiais no username
- **Rastreabilidade:** `auth.js` → validação de formulário de cadastro → `src/controllers/authController.js`
- **Objetivo:** Garantir que apenas caracteres alfanuméricos sejam aceitos no username.
- **Pré-condições:** Nenhuma.
- **Dados de teste:** username: `admin@123`
- **Passos:**
  1. Acessar `register.html`.
  2. Informar `admin@123` no campo username.
  3. Sair do campo ou tentar submeter.
- **Ação:** Acionar a validação do input.
- **Resultado esperado:** Campo destacado com erro e mensagem indicando que apenas alfanuméricos são permitidos.
- **Pós-condições:** Formulário não deve ser enviado.

## TC-FE-003
- **Nome:** Bloqueio de e-mail mal formatado
- **Rastreabilidade:** `auth.js` → validação HTML5/JS → `src/controllers/authController.js`
- **Objetivo:** Validar a rejeição de e-mail inválido.
- **Pré-condições:** Nenhuma.
- **Dados de teste:** email: `admin.macuxi`
- **Passos:**
  1. Acessar `register.html`.
  2. Informar um e-mail inválido.
  3. Submeter o formulário.
- **Ação:** Tentar registrar com e-mail inválido.
- **Resultado esperado:** O formulário não é enviado e a interface indica erro de e-mail inválido.
- **Pós-condições:** Nenhum usuário é criado.

## TC-FE-004
- **Nome:** Bloqueio de senha curta
- **Rastreabilidade:** `auth.js` → validação de cadastro → `src/controllers/authController.js`
- **Objetivo:** Garantir senha com mínimo de 6 caracteres.
- **Pré-condições:** Nenhuma.
- **Dados de teste:** senha: `12345`
- **Passos:**
  1. Acessar `register.html`.
  2. Preencher senha com 5 caracteres.
  3. Submeter o formulário.
- **Ação:** Tentar cadastrar com senha curta.
- **Resultado esperado:** Mensagem de validação informando o tamanho mínimo da senha.
- **Pós-condições:** Submissão cancelada.

## TC-FE-005
- **Nome:** Campos obrigatórios no registro
- **Rastreabilidade:** `auth.js` → formulário de cadastro → `src/controllers/authController.js`
- **Objetivo:** Validar impedimento de envio com campos vazios.
- **Pré-condições:** Nenhuma.
- **Dados de teste:** campos vazios.
- **Passos:**
  1. Abrir `register.html`.
  2. Deixar os campos em branco.
  3. Clicar em **Cadastrar**.
- **Ação:** Submeter formulário vazio.
- **Resultado esperado:** O foco é direcionado ao primeiro campo vazio e o envio não ocorre.
- **Pós-condições:** Nenhuma alteração de estado.

## TC-FE-006
- **Nome:** Login com sucesso na página `login.html`
- **Rastreabilidade:** `auth.js` → `POST /auth/login` → `src/controllers/authController.js`
- **Objetivo:** Validar autenticação bem-sucedida.
- **Pré-condições:** Usuário existente na API.
- **Dados de teste:** email e senha válidos do usuário cadastrado.
- **Passos:**
  1. Abrir `login.html`.
  2. Informar credenciais válidas.
  3. Clicar em **Entrar**.
- **Ação:** Enviar o formulário de login.
- **Resultado esperado:** Token JWT salvo no `localStorage` e redirecionamento para `dashboard.html`.
- **Pós-condições:** Sessão ativa no navegador.

## TC-FE-007
- **Nome:** Feedback de credenciais inválidas
- **Rastreabilidade:** `auth.js` → tratamento de erro de login → `src/controllers/authController.js`
- **Objetivo:** Verificar retorno amigável para credenciais incorretas.
- **Pré-condições:** Usuário existente na API.
- **Dados de teste:** email correto e senha incorreta.
- **Passos:**
  1. Abrir `login.html`.
  2. Preencher e-mail válido e senha errada.
  3. Submeter.
- **Ação:** Tentar autenticar com senha inválida.
- **Resultado esperado:** Exibir mensagem de erro amigável sem limpar o e-mail.
- **Pós-condições:** Nenhum token deve ser salvo.

## TC-FE-008
- **Nome:** Bloqueio de login com campos vazios
- **Rastreabilidade:** `auth.js` → validação HTML5/JS → `src/controllers/authController.js`
- **Objetivo:** Garantir obrigatoriedade dos campos de login.
- **Pré-condições:** Nenhuma.
- **Dados de teste:** campos vazios.
- **Passos:**
  1. Abrir `login.html`.
  2. Deixar os campos em branco.
  3. Clicar em **Entrar**.
- **Ação:** Submeter o formulário vazio.
- **Resultado esperado:** Mensagens de validação de campo obrigatório.
- **Pós-condições:** Formulário não enviado.

## TC-FE-009
- **Nome:** Logout na barra de navegação
- **Rastreabilidade:** `app.js` → ação de logout → sessão local
- **Objetivo:** Validar remoção da sessão ativa.
- **Pré-condições:** Usuário logado.
- **Dados de teste:** token JWT armazenado.
- **Passos:**
  1. Acessar qualquer página autenticada.
  2. Clicar em **Sair**.
- **Ação:** Executar logout pela navegação.
- **Resultado esperado:** Token removido do `localStorage` e redirecionamento para `index.html`.
- **Pós-condições:** Sessão encerrada.

## TC-FE-010
- **Nome:** Proteção de rotas privadas no front-end
- **Rastreabilidade:** `app.js` → `requireAuth()` → páginas privadas
- **Objetivo:** Validar redirecionamento sem autenticação.
- **Pré-condições:** Sem token no `localStorage`.
- **Dados de teste:** nenhum.
- **Passos:**
  1. Abrir `dashboard.html` diretamente pela URL.
  2. Aguardar a inicialização do script.
- **Ação:** Tentar acessar rota privada sem sessão.
- **Resultado esperado:** Redirecionamento para `login.html`.
- **Pós-condições:** A página privada não deve permanecer acessível.
