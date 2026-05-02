# Especificação de Casos de Teste - Domínio de Precificação e Cálculos (LabPrice API)

Esta suíte de testes abrange o coração do sistema: o Motor de Precificação (Épico 2). Os casos de teste validam a exatidão das fórmulas matemáticas, a correta aplicação das regras de negócio para taxas opcionais e margens de lucro (RN03, RN04, RN05) e a cobertura de diferentes status codes HTTP para os cenários de sucesso (Caminho Feliz) e falha (Caminho Triste).

---

### **TC-CALC-001: Cálculo de Orçamento Base (Caminho Feliz - Apenas Obrigatórios)**
*   **Rastreabilidade:** Épico 2 > US04 | RF04, RN04
*   **Objetivo:** Garantir que o sistema calcule corretamente o custo e o lucro básico quando apenas os parâmetros obrigatórios são enviados, mantendo as taxas opcionais (depreciação e falha) desativadas por padrão.
*   **Pré-condições:** Nenhuma (endpoint de cálculo não exige persistência).
*   **Dados de Teste (Payload):**
    ```json
    {
      "peso_g": 100,
      "custo_kg": 100,
      "potencia_w": 200,
      "tempo_h": 5,
      "tarifa_kwh": 1.0,
      "markup_pct": 50,
      "taxa_plataforma_pct": 0
    }
    ```

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /quote/calculate` com o payload de teste. | A requisição é processada com sucesso. |
| 2 | Verificar o status da resposta. | A API deve retornar **200 OK**. |
| 3 | Validar os valores matemáticos no JSON de resposta. | Custo Material = R$ 10,00; Custo Energia = R$ 1,00; Custo Total de Produção = R$ 11,00; Lucro (50%) = R$ 5,50; Preço Final de Venda = R$ 16,50. Taxas de depreciação e risco devem constar como 0. |

*   **Pós-condições:** O orçamento é retornado, mas não é salvo na base de dados.

---

### **TC-CALC-002: Cálculo Completo com Taxas Opcionais e Plataforma (Caminho Feliz)**
*   **Rastreabilidade:** Épico 2 > US05 | RN04, RN05, RF04
*   **Objetivo:** Validar o cálculo com todas as variáveis ativadas, garantindo que a taxa de plataforma incida sobre o valor final de venda (protegendo o lucro real) e que depreciação e risco sejam somados corretamente.
*   **Pré-condições:** Nenhuma.
*   **Dados de Teste (Payload):**
    ```json
    {
      "peso_g": 100,
      "custo_kg": 100,
      "potencia_w": 200,
      "tempo_h": 5,
      "tarifa_kwh": 1.0,
      "usar_depreciacao": true,
      "valor_maquina": 2000,
      "vida_util_h": 2000,
      "usar_taxa_falha": true,
      "porcentagem_falha": 10,
      "tempo_pos_processamento_h": 1,
      "taxa_hora_pos_processamento": 10,
      "markup_pct": 50,
      "taxa_plataforma_pct": 10
    }
    ```

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /quote/calculate` com o payload de teste. | A API processa o cálculo completo. |
| 2 | Verificar o status da resposta. | A API deve retornar **200 OK**. |
| 3 | Validar os custos parciais. | Material = R$ 10,00; Energia = R$ 1,00; Depreciação = R$ 5,00; Preço Base = R$ 16,00. Taxa Risco = R$ 1,60. Pós-processamento = R$ 10,00. Custo Produção = R$ 27,60. |
| 4 | Validar Lucro e Preço Final. | Lucro Bruto (50% do custo) = R$ 13,80. Preço Final (Margem Real com 10% da plataforma) = **R$ 46,00**. |

*   **Pós-condições:** Resposta gerada corretamente em memória, sem persistência.

---

### **TC-CALC-003: Rejeição por Variáveis Opcionais Incompletas (Caminho Triste)**
*   **Rastreabilidade:** Épico 2 > US05 | RN03
*   **Objetivo:** Assegurar que se o usuário ativar uma flag (ex: `usar_depreciacao`), mas esquecer de enviar os valores necessários para a fórmula, o sistema aborte a operação.
*   **Pré-condições:** Nenhuma.
*   **Dados de Teste (Payload):**
    ```json
    {
      "peso_g": 100,
      "custo_kg": 100,
      "potencia_w": 200,
      "tempo_h": 5,
      "tarifa_kwh": 1.0,
      "markup_pct": 50,
      "usar_depreciacao": true
    }
    ```
    *(Nota: `valor_maquina` e `vida_util_h` estão intencionalmente ausentes).*

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /quote/calculate` com o payload incompleto. | O middleware ou controller de validação intercepta a falta de dados. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar **400 Bad Request**. O JSON de erro deve especificar que `valor_maquina` e `vida_util_h` são obrigatórios quando `usar_depreciacao` é verdadeiro. |

---

### **TC-CALC-004: Rejeição por Ausência de Parâmetros Obrigatórios (Caminho Triste)**
*   **Rastreabilidade:** Épico 2 > US04 | RF04
*   **Objetivo:** Garantir que o motor de cálculo não tente processar dados nulos ou vazios para variáveis centrais da fórmula (peso, tempo, potência), evitando falhas de servidor (status 500).
*   **Pré-condições:** Nenhuma.
*   **Dados de Teste (Payload):**
    ```json
    {
      "potencia_w": 200,
      "tempo_h": 5,
      "markup_pct": 50
    }
    ```
    *(Nota: Falta `peso_g` e `custo_kg`).*

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /quote/calculate` com o payload de teste. | A API aborta a execução antes do cálculo. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar **400 Bad Request**. A mensagem de erro deve listar os campos obrigatórios ausentes (`peso_g`, `custo_kg`, `tarifa_kwh`). |

---

### **TC-CALC-005: Rejeição de Valores Negativos ou Inválidos (Caminho Triste)**
*   **Rastreabilidade:** Épico 2 > US04
*   **Objetivo:** Impedir a inserção de dados matematicamente impossíveis no contexto do negócio (ex: peso negativo, tempo negativo), garantindo a integridade do cálculo final.
*   **Pré-condições:** Nenhuma.
*   **Dados de Teste (Payload):**
    ```json
    {
      "peso_g": -50,
      "custo_kg": 100,
      "potencia_w": 200,
      "tempo_h": -2,
      "tarifa_kwh": 1.0,
      "markup_pct": 50
    }
    ```

| Passo | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| 1 | Enviar requisição HTTP `POST /quote/calculate` com valores negativos. | A validação do schema/payload intercepta a anomalia. |
| 2 | Verificar o status e corpo da resposta. | A API deve retornar **400 Bad Request**. A resposta deve indicar que `peso_g` e `tempo_h` devem ser valores maiores ou iguais a zero. |