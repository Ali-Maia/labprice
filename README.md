# LabPrice — API de Precificação para Impressão 3D

LabPrice é uma API RESTful (Node.js + Express) que automatiza o cálculo de custos e a gestão de um catálogo de produtos de impressão 3D. Ela transforma parâmetros técnicos (gramas, tempo, potência, etc.) em um orçamento detalhado e permite salvar esse orçamento como um produto no catálogo.

Principais objetivos:
- Calcular custo real por peça considerando material, energia, depreciação, risco e pós-processamento;
- Proteger a margem de lucro frente a taxas de plataforma (marketplaces);
- Persistir orçamentos validados como produtos em um catálogo simples em memória;
- Documentar a API com Swagger para testes interativos.

---

## Como funciona (visão rápida)

- Endpoints de autenticação (cadastro/login) geram tokens JWT para proteger rotas sensíveis.
- O motor de precificação recebe parâmetros técnicos e aplica as fórmulas (material, energia, depreciação, risco, pós-processamento, markup e taxa de plataforma) retornando um objeto detalhado com custos e preço final.
- Um orçamento validado pode ser convertido em produto via `POST /products`; produtos são armazenados em memória e carregam o histórico completo do cálculo.
- Atualizações em variáveis de custo acionam o recálculo automático do produto.

---

## Rodando o projeto (passo a passo)

Pré-requisitos:
- Node.js 14+ e npm instalado.

1. Abra um terminal e instale dependências:

```bash
cd "d:\workspace\Mentoria Testes\turma3\portfolio\labprice"
npm install
```

2. Inicie o servidor:

```bash
npm start
# ou (modo dev, requer Node com "--watch")
npm run dev
```

3. Acesse a documentação interativa (Swagger):

```
http://localhost:3000/api-docs
```

4. Testes / exemplos:
- Use o arquivo `EXEMPLOS_TESTE.sh` (curl) ou o Swagger UI para executar: registro, login, calcular orçamento, criar/listar/atualizar/excluir produtos.

---

## Principais endpoints

- `POST /auth/register` — Cadastrar administrador (username alfanumérico, email, senha ≥6)
- `POST /auth/login` — Login e geração de token JWT
- `GET /users` — Listar usuários (protegido)
- `POST /quote/calculate` — Calcular orçamento (retorna detalhamento, não persiste)
- `POST /products` — Converter orçamento em produto (protegido)
- `GET /products` — Listar produtos (protegido)
- `GET /products/:id` — Detalhar produto (protegido)
- `PUT /products/:id` — Atualizar produto (recalcula automaticamente) (protegido)
- `DELETE /products/:id` — Deletar produto (protegido)

---

## Configurações e variáveis

- `PORT` — Porta do servidor (padrão: `3000`).
- `JWT_SECRET` — Se não definido, a aplicação usa um secret de desenvolvimento; **defina em produção**.

Arquivo de configuração principal: `src/server.js` e `src/middleware/authMiddleware.js`.

---

## Observações

- O banco de dados é em memória: todos os dados serão perdidos ao reiniciar o servidor (adequado para MVP/desenvolvimento). Para produção, é recomendado migrar para PostgreSQL ou MongoDB.
- A documentação Swagger está disponível em `/api-docs` e serve de guia para todos os parâmetros e respostas.

 ---

## Fluxo de Trabalho (Endpoints)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Cadastro de novo usuário |
| `POST` | `/auth/login` | Login e geração de Token JWT |
| `POST` | `/quote/calculate` | Realiza o cálculo sem salvar no banco |
| `POST` | `/products` | Salva um cálculo realizado como um Produto |
| `GET` | `/products` | Lista todos os produtos cadastrados |
| `GET` | `/products/:id` | Detalhamento completo (custos e lucro) |
| `PUT` | `/products/:id` | Atualiza dados e recalcula o produto |
| `DELETE` | `/products/:id` | Remove o produto do sistema |

---

## Estrutura de Dados (Exemplo de Retorno)

```json
{
  "id": "uuid-v4",
  "identificacao_produto": "Vaso Macuxi Art",
  "preco_venda": 125.50,
  "lucro_liquido": 45.00,
  "detalhamento": {
    "material": 15.20,
    "energia": 2.10,
    "consumiveis": 5.00,
    "risco": 1.50,
    "producao_total": 80.50,
    "pos_processamento": 20.00
  }
}