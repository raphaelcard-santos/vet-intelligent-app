# Documentação da API de Diagnóstico com IA

Esta documentação descreve como utilizar a API para obter sugestões de diagnóstico veterinário baseadas em Inteligência Artificial (IA).

## Endpoint

- **Método:** `POST`
- **URL:** `/api/diagnostico`

## Descrição

Esta API recebe informações sobre um animal (ID), seus sintomas e observações adicionais. Utiliza um modelo de IA (atualmente simulado) para analisar esses dados e retornar possíveis diagnósticos, tratamentos sugeridos e níveis de urgência. A API também inclui um aviso legal importante sobre a natureza auxiliar das informações.

## Autenticação

- **Tipo:** Bearer Token
- **Header:** `Authorization: Bearer <SEU_TOKEN>`

É necessário enviar um token de autenticação válido no cabeçalho da requisição. No ambiente de teste atual, o token `SIMULATED_TOKEN` pode ser usado para simular um usuário autenticado.

## Corpo da Requisição (Request Body)

- **Formato:** JSON
- **Campos:**
    - `animalId` (string, obrigatório): O ID único do animal para o qual o diagnóstico está sendo solicitado.
    - `sintomas` (array de strings, obrigatório): Uma lista dos sintomas observados no animal. Deve conter pelo menos um sintoma.
    - `observacoesAdicionais` (string, opcional): Qualquer informação adicional relevante que possa ajudar no diagnóstico.

**Exemplo de Corpo da Requisição:**

```json
{
  "animalId": "1",
  "sintomas": ["Vômito", "Febre", "Apatia"],
  "observacoesAdicionais": "Animal não come há 1 dia e está muito quieto."
}
```

## Resposta de Sucesso (200 OK)

A API retorna um objeto JSON contendo as sugestões de diagnóstico e informações relacionadas.

- **Campos:**
    - `diagnosticoId` (string): ID único gerado para esta solicitação de diagnóstico.
    - `dataHora` (string): Data e hora da solicitação no formato ISO 8601.
    - `animalInfo` (objeto): Informações básicas do animal (obtidas dos dados simulados).
        - `especie` (string)
        - `raca` (string)
        - `idade` (string)
        - `peso` (string)
    - `sintomasFornecidos` (array de strings): Lista de sintomas enviados na requisição.
    - `observacoesFornecidas` (string): Observações adicionais enviadas na requisição.
    - `sugestoesDiagnosticas` (array de objetos): Lista de possíveis diagnósticos sugeridos pela IA.
        - `condicao` (string): Nome da condição suspeita.
        - `probabilidade_estimada` (string): Estimativa da probabilidade (Alta, Média, Baixa).
        - `descricao` (string): Breve descrição da condição.
        - `tratamentos_sugeridos` (array de strings): Sugestões de tratamento inicial (não substituem prescrição veterinária).
        - `nivel_urgencia` (string): Nível de urgência estimado (Alto, Médio, Baixo).
        - `observacoes_adicionais` (string): Outras informações ou recomendações relevantes.
    - `disclaimer` (string): Aviso legal sobre o uso das informações da IA.

**Exemplo de Resposta de Sucesso (usando dados simulados):**

```json
{
  "diagnosticoId": "c402c3d6-c849-4077-b4a3-f8ac70cd1c86",
  "dataHora": "2025-05-17T23:24:31.537Z",
  "animalInfo": {
    "especie": "Cão",
    "raca": "Labrador",
    "idade": "3 anos",
    "peso": "28 kg"
  },
  "sintomasFornecidos": [
    "Vômito",
    "Febre"
  ],
  "observacoesFornecidas": "Animal apático há 2 dias.",
  "sugestoesDiagnosticas": [
    {
      "condicao": "Gastroenterite Viral Canina (Simulada)",
      "probabilidade_estimada": "Alta",
      "descricao": "Inflamação do estômago e intestinos causada por um vírus. Comum em cães não vacinados.",
      "tratamentos_sugeridos": [
        "Manter o animal hidratado com soro oral ou fluidoterapia intravenosa (em casos graves).",
        "Jejum alimentar por 12-24 horas, seguido de dieta leve e de fácil digestão (ex: frango cozido sem pele e arroz branco).",
        "Medicação sintomática para vômito e diarreia, conforme prescrição veterinária.",
        "Isolamento de outros cães para evitar contágio."
      ],
      "nivel_urgencia": "Médio a Alto (dependendo da severidade dos sintomas e estado de hidratação)",
      "observacoes_adicionais": "A vacinação é a principal forma de prevenção. Procurar um veterinário para confirmação e tratamento adequado."
    },
    {
      "condicao": "Intoxicação Alimentar (Simulada)",
      "probabilidade_estimada": "Média",
      "descricao": "Ingestão de alimento contaminado ou inadequado para a espécie.",
      "tratamentos_sugeridos": [
        "Indução do vômito (apenas se a ingestão foi recente e sob orientação veterinária).",
        "Carvão ativado para adsorver toxinas.",
        "Suporte com fluidoterapia e protetores gástricos."
      ],
      "nivel_urgencia": "Médio",
      "observacoes_adicionais": "Identificar e remover a fonte da intoxicação. Observar atentamente a evolução dos sintomas."
    }
  ],
  "disclaimer": "Este é um sistema de auxílio ao diagnóstico baseado em Inteligência Artificial. As informações fornecidas são sugestões e NÃO substituem a avaliação, diagnóstico e tratamento por um médico veterinário qualificado. Sempre consulte um profissional para questões de saúde do seu animal."
}
```

## Respostas de Erro

- **400 Bad Request:** Dados inválidos ou ausentes na requisição (ex: falta `animalId` ou `sintomas`).
  ```json
  { "message": "Dados insuficientes para diagnóstico. animalId e sintomas são obrigatórios." }
  ```
- **401 Unauthorized:** Token de autenticação ausente, inválido ou expirado.
  ```json
  { "message": "Não autorizado, nenhum token fornecido" }
  ```
  ```json
  { "message": "Não autorizado, token inválido ou expirado (simulação)" }
  ```
- **404 Not Found:** O `animalId` fornecido não corresponde a nenhum animal nos dados simulados.
  ```json
  { "message": "Animal não encontrado ou não pertence ao usuário." }
  ```
- **500 Internal Server Error:** Erro inesperado durante o processamento no servidor.
  ```json
  { "message": "Erro interno do servidor ao processar o diagnóstico.", "error": "<mensagem detalhada do erro, se disponível>" }
  ```

## Observações Importantes

- **Modo Simulado:** Atualmente, a API opera em modo simulado. A chamada para a IA (OpenAI GPT-4) e a consulta ao banco de dados para buscar informações do animal são simuladas. Os dados do animal são obtidos de uma estrutura interna (`animaisSimulados`) e a resposta da IA é pré-definida.
- **Disclaimer:** O campo `disclaimer` na resposta é crucial e deve ser exibido de forma clara ao usuário final, reforçando que as sugestões da IA são apenas informativas e não substituem a consulta a um veterinário.
- **Chave de API OpenAI:** Para habilitar a funcionalidade real com o GPT-4, será necessário configurar uma chave de API válida da OpenAI no ambiente do backend e substituir a função `simularChamadaOpenAI` pela chamada real.
- **Banco de Dados:** Para buscar informações reais dos animais, a lógica de consulta ao banco de dados no `diagnosticoController.js` precisa ser descomentada e adaptada à estrutura real do banco de dados PostgreSQL.

