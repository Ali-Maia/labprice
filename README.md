# LabPrice - API de Precificação para Impressão 3D

## Visão Geral
O **LabPrice** é uma API desenvolvida para automatizar o cálculo de custos e a precificação de produtos de impressão 3D. O sistema permite transformar orçamentos técnicos em produtos de estoque, considerando variáveis de material, energia, depreciação e taxas de mercado.

---

## Regras de Negócio e Segurança

### 1. Autenticação e Usuários
* **Cadastro de Usuário:**
    * `username`: Obrigatório, sem espaços ou caracteres especiais (Regex: `^[a-zA-Z0-9]+$`).
    * `email`: Deve ser um e-mail válido.
    * `password`: Mínimo de 6 caracteres. Proibido o uso de caracteres invisíveis (*Unicode whitespace/Zero-width*).
* **Segurança:** Implementação de **JWT (JSON Web Token)** para persistência de sessão.
* **Autorização:** A consulta de usuários é restrita a perfis com permissões administrativas.
* **Persistência:** Banco de dados em memória local (Array/Map) para esta versão.

---

## Motor de Cálculo (Lógica de Precificação)

Para todos os cálculos, o tempo é convertido para valor decimal:
`Tempo (T) = Horas + (Minutos / 60)`

### Fórmulas Base

1.  **Custo de Material ($C_{mat}$):**
    $$C_{mat} = (Peso_{g} / 1000) \times Custo_{kg}$$

2.  **Custo de Energia ($C_{ene}$):**
    $$C_{ene} = (Potência_{W} / 1000) \times T_{impressão} \times Tarifa_{kWh}$$

3.  **Depreciação de Máquina ($C_{dep}$) - *Opcional*:**
    $$C_{dep} = (Valor_{máquina} / VidaÚtil_{horas}) \times T_{impressão}$$

4.  **Taxa de Falha/Risco ($C_{risco}$) - *Opcional*:**
    $$C_{risco} = (C_{mat} + C_{ene} + C_{dep}) \times (\%Falha / 100)$$

5.  **Pós-Processamento ($C_{pós}$):**
    $$C_{pós} = T_{trabalho} \times TaxaHorária$$

6.  **Custo de Produção ($C_{prod}$):**
    $$C_{prod} = C_{mat} + C_{ene} + C_{dep} + C_{risco} + C_{pós} + CustosAdicionais + Embalagem$$

### Preço Final e Lucro

* **Markup (Lucro Desejado):** Aplicado sobre o custo total de produção.
* **Taxa de Envio/Venda:** Caso haja porcentagem de plataforma (ex: marketplace), o cálculo de preço final utiliza a fórmula de margem:
    $$Preço_{venda} = \frac{C_{prod} + Lucro}{1 - (\%TaxaPlataforma / 100)}$$

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