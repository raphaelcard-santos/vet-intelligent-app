# Plano de Implementação do Sistema de Diagnóstico com IA

## 1. Pesquisa e Planejamento

### 1.1 Requisitos Funcionais
- Sistema deve receber sintomas e informações do animal (espécie, raça, idade, peso)
- Sistema deve processar essas informações e retornar possíveis diagnósticos
- Cada diagnóstico deve incluir:
  - Nome da condição
  - Probabilidade estimada
  - Descrição breve
  - Possíveis tratamentos
  - Nível de urgência (baixo, médio, alto)
- Sistema deve incluir disclaimer sobre ser apenas uma ferramenta de auxílio
- Veterinários devem poder adicionar notas e confirmar/descartar diagnósticos

### 1.2 Modelos de IA Disponíveis
- OpenAI GPT-4 (ou versão mais recente)
- Anthropic Claude
- Google Gemini
- Modelos open-source como Llama 2 ou Mistral

### 1.3 Considerações Éticas e Legais
- Transparência sobre o uso de IA
- Disclaimer claro sobre limitações
- Armazenamento seguro de dados sensíveis
- Conformidade com regulamentações veterinárias
- Necessidade de revisão humana (veterinário) para diagnósticos finais

### 1.4 Fluxo de Dados Proposto
1. Usuário insere dados do animal e sintomas observados
2. Frontend envia dados para o backend
3. Backend formata os dados em um prompt estruturado
4. Backend envia prompt para a API do modelo de IA
5. IA processa e retorna possíveis diagnósticos
6. Backend formata a resposta e envia para o frontend
7. Frontend exibe os resultados de forma organizada e compreensível

### 1.5 Estrutura de Dados
- Entrada:
  - Dados do animal (espécie, raça, idade, peso)
  - Sintomas (lista de sintomas observados)
  - Histórico relevante (opcional)
- Saída:
  - Lista de possíveis diagnósticos
  - Para cada diagnóstico: nome, probabilidade, descrição, tratamentos, urgência

## 2. Implementação Técnica

### 2.1 Backend
- Criar nova rota `/api/diagnostico`
- Implementar middleware de autenticação
- Desenvolver lógica de formatação de prompt
- Integrar com API do modelo de IA escolhido
- Implementar cache para consultas similares (otimização)
- Criar sistema de logging para melhorias futuras

### 2.2 Frontend
- Criar tela de entrada de dados do animal
- Desenvolver interface para seleção de sintomas (categorizada)
- Implementar tela de resultados com visualização clara dos diagnósticos
- Adicionar funcionalidade para salvar diagnósticos no histórico do animal
- Incluir disclaimers e informações sobre limitações da IA

### 2.3 Integração
- Conectar frontend e backend
- Implementar tratamento de erros e fallbacks
- Adicionar indicadores de carregamento durante processamento
- Garantir persistência de dados no histórico do animal

## 3. Testes e Validação
- Testar com casos conhecidos para verificar precisão
- Validar interface com usuários (veterinários)
- Realizar testes de carga e performance
- Verificar conformidade com requisitos éticos e legais

## 4. Documentação
- Documentar API e fluxo de dados
- Criar guia de uso para veterinários
- Documentar limitações conhecidas e casos de uso recomendados



## 1.6. Definição do Modelo LLM e Fluxo de Prompt

### 1.6.1. Escolha do Modelo LLM

Para o desenvolvimento inicial do sistema de diagnóstico auxiliado por IA, optaremos por utilizar um dos modelos avançados da **OpenAI (como GPT-4 ou o modelo mais recente disponível via API)**. Esta escolha se baseia nos seguintes fatores:

*   **Capacidade Avançada:** Modelos como o GPT-4 demonstraram forte capacidade de raciocínio, compreensão de nuances e geração de texto coerente e informativo, o que é crucial para um sistema de auxílio diagnóstico.
*   **API Madura e Documentação:** A OpenAI oferece uma API bem documentada e robusta, facilitando a integração com o backend da nossa aplicação.
*   **Recursos de Fine-tuning (Futuro):** Embora não seja o foco inicial, a possibilidade de realizar fine-tuning no futuro com dados veterinários específicos pode aprimorar significativamente a precisão do sistema.
*   **Comunidade e Suporte:** Existe uma vasta comunidade e muitos recursos disponíveis para desenvolvedores que utilizam as APIs da OpenAI.

**Alternativas Consideradas:**
*   **Google Gemini (Pro/Ultra):** Também é uma excelente opção com capacidades comparáveis. A escolha final pode depender de testes comparativos de custo-benefício e facilidade de integração específica para o caso de uso veterinário.
*   **Anthropic Claude:** Outro modelo de ponta com foco em segurança e conversações mais longas, poderia ser uma alternativa viável.
*   **Modelos Open Source (Llama, Mistral):** Poderiam ser explorados em fases posteriores para otimizar custos ou ter maior controle sobre o modelo, mas para a fase inicial, priorizamos a capacidade e a facilidade de integração de modelos proprietários.

### 1.6.2. Estrutura e Fluxo de Prompt

O prompt enviado ao LLM será cuidadosamente estruturado para maximizar a relevância e a segurança das respostas. Ele será construído dinamicamente pelo backend com base nas informações fornecidas pelo usuário.

**Componentes do Prompt:**

1.  **Contexto do Sistema (System Message/Instrução Inicial):**
    *   Definir o papel do LLM: "Você é um assistente de IA especializado em fornecer informações de auxílio ao diagnóstico veterinário. Seu objetivo é analisar os dados do animal e os sintomas fornecidos para sugerir possíveis condições, tratamentos iniciais e níveis de urgência. Suas sugestões NÃO substituem o diagnóstico de um veterinário profissional e devem sempre ser interpretadas como um auxílio informativo."
    *   Instruções sobre o formato da resposta: Solicitar uma resposta estruturada (preferencialmente JSON) para facilitar o parsing pelo backend. Ex: `{"diagnosticos": [{"condicao": "Nome da Condição", "probabilidade_estimada": "Alta/Média/Baixa", "descricao": "Breve descrição", "tratamentos_sugeridos": ["Tratamento 1", "Tratamento 2"], "nivel_urgencia": "Alto/Médio/Baixo", "observacoes_adicionais": "Notas importantes"}]}`.
    *   Instruções de segurança: "Priorize sempre a segurança do animal. Se os sintomas indicarem uma emergência clara, destaque isso imediatamente. Evite fornecer dosagens exatas de medicamentos, focando em tipos de tratamento ou cuidados gerais."

2.  **Informações do Animal (User Message - Parte 1):**
    *   Espécie: (Ex: Cão, Gato, Ave, etc.)
    *   Raça: (Ex: Labrador, Siamês, Calopsita, etc.)
    *   Idade: (Ex: 2 anos, 5 meses, filhote, idoso)
    *   Peso: (Ex: 10 kg, 500g - opcional, mas útil)
    *   Sexo: (Ex: Macho, Fêmea, Castrado/Não Castrado - opcional)
    *   Histórico Médico Relevante (se fornecido pelo usuário): (Ex: "Já teve problemas renais", "É diabético")

3.  **Sintomas Observados (User Message - Parte 2):**
    *   Lista de sintomas principais: (Ex: Vômito, Diarreia, Letargia, Perda de apetite, Tosse)
    *   Duração dos sintomas: (Ex: "Vômito há 2 dias", "Tosse há 1 semana")
    *   Frequência/Intensidade: (Ex: "Vômito 3 vezes hoje", "Diarreia aquosa e frequente")
    *   Outras observações relevantes: (Ex: "Comeu algo estranho ontem", "Teve contato com outros animais doentes")

**Exemplo de Prompt (simplificado, para o LLM):**

```
Você é um assistente de IA especializado em fornecer informações de auxílio ao diagnóstico veterinário. Seu objetivo é analisar os dados do animal e os sintomas fornecidos para sugerir possíveis condições, tratamentos iniciais e níveis de urgência. Suas sugestões NÃO substituem o diagnóstico de um veterinário profissional e devem sempre ser interpretadas como um auxílio informativo. Priorize sempre a segurança do animal. Se os sintomas indicarem uma emergência clara, destaque isso imediatamente. Evite fornecer dosagens exatas de medicamentos. Responda em formato JSON conforme o seguinte esquema: {"diagnosticos": [{"condicao": "string", "probabilidade_estimada": "Alta|Média|Baixa", "descricao": "string", "tratamentos_sugeridos": ["string"], "nivel_urgencia": "Alto|Média|Baixo", "observacoes_adicionais": "string"}]}

Dados do Animal:
- Espécie: Cão
- Raça: Labrador
- Idade: 3 anos
- Peso: 28 kg
- Histórico: Nenhuma condição pré-existente conhecida.

Sintomas Observados:
- Vômito: Ocorrendo há 1 dia, aproximadamente 4 episódios. Conteúdo amarelado.
- Letargia: Animal aparenta estar mais quieto e menos disposto a brincar desde ontem.
- Perda de apetite: Recusou a ração hoje pela manhã.

Com base nessas informações, forneça possíveis diagnósticos, incluindo probabilidade, descrição, tratamentos sugeridos, nível de urgência e observações adicionais, no formato JSON especificado.
```

**Fluxo de Interação:**

1.  O frontend coleta as informações do animal e os sintomas através de formulários estruturados e, possivelmente, seletores de sintomas.
2.  Os dados são enviados ao backend.
3.  O backend valida os dados e constrói o prompt conforme a estrutura acima.
4.  O backend faz a chamada para a API do LLM escolhido (OpenAI).
5.  O LLM processa o prompt e retorna a resposta (idealmente em JSON).
6.  O backend faz o parse da resposta JSON. Se a resposta não vier em JSON ou estiver malformada, tenta uma nova chamada ou implementa uma lógica de extração de informações do texto.
7.  O backend pode enriquecer a resposta com informações adicionais do banco de dados (ex: links para artigos, informações sobre veterinários próximos se relevante).
8.  O backend envia a resposta processada para o frontend.
9.  O frontend exibe os resultados de forma clara e organizada, incluindo todos os disclaimers de segurança e a natureza informativa da ferramenta.

**Considerações Adicionais para o Prompt:**
*   **Iteração e Refinamento:** A estrutura do prompt provavelmente precisará de várias iterações e refinamentos com base nos resultados dos testes.
*   **Temperatura da IA:** Ajustar o parâmetro de "temperatura" da API do LLM para controlar a criatividade vs. previsibilidade das respostas. Para diagnósticos, uma temperatura mais baixa (mais factual) pode ser preferível.
*   **Limitação de Tokens:** Estar ciente dos limites de tokens de entrada e saída da API do LLM.
*   **Tratamento de Casos Ambíguos:** Instruir o LLM sobre como lidar com informações insuficientes ou ambíguas (ex: sugerir procurar um veterinário para mais exames).

Esta definição servirá como base para a implementação da API no backend e das telas no frontend.

## 1.6.3. Detalhamento do Fluxo da API e Modelo de Dados para Diagnóstico

Com base nas confirmações do usuário (GPT-4, armazenamento de diagnósticos, sem preferência de disclaimer), detalhamos o fluxo da API e o modelo de dados:

**API Endpoint:** `POST /api/diagnostico`

**Autenticação:** Requer token de usuário autenticado.

**Request Body (JSON):**
```json
{
  "animalId": "string", // ID do animal cadastrado
  "sintomas": ["string"], // Lista de sintomas observados
  "observacoesAdicionais": "string" // Opcional: informações extras fornecidas pelo usuário
}
```

**Lógica do Backend:**
1.  Validar o `request body` e a autenticação do usuário.
2.  Consultar o banco de dados para obter informações detalhadas do animal (`especie`, `raca`, `idade`, `peso`, `historicoMedicoRelevante`) usando o `animalId`.
3.  Construir o prompt para o GPT-4 conforme a estrutura definida na seção "1.6.2. Estrutura e Fluxo de Prompt", utilizando os dados do animal, `sintomas` e `observacoesAdicionais`.
4.  Enviar o prompt para a API do OpenAI GPT-4.
    *   *Nota: Inicialmente, pode-se usar uma resposta mockada para desenvolvimento do fluxo, até que a chave da API do usuário seja fornecida e configurada.*
5.  Receber e processar a resposta do LLM (idealmente JSON). Realizar parsing e validação da estrutura.
6.  Formatar a resposta para o frontend, incluindo um disclaimer padrão.
7.  Salvar os dados da solicitação e a resposta processada em uma nova tabela `HistoricoDiagnosticosIA` no banco de dados. Esta tabela deve conter:
    *   `id` (PK)
    *   `animalId` (FK para a tabela `Animais`)
    *   `usuarioId` (FK para a tabela `Usuarios` - quem solicitou o diagnóstico)
    *   `dataHoraSolicitacao` (Timestamp)
    *   `dadosEntradaPrompt` (JSON/TEXT - para auditoria, contendo os sintomas e dados do animal enviados ao LLM)
    *   `respostaLLMBruta` (JSON/TEXT - resposta original do LLM, para referência e reprocessamento futuro, se necessário)
    *   `sugestoesProcessadas` (JSON/TEXT - a estrutura que é enviada ao frontend e armazenada para exibição no histórico)
    *   `disclaimerExibido` (TEXT - o texto do disclaimer que foi apresentado ao usuário)
8.  Retornar a resposta formatada para o frontend.

**Response Body (JSON):**
```json
{
  "diagnosticoId": "string", // ID do registro na tabela HistoricoDiagnosticosIA
  "dataHora": "timestamp",
  "animalInfo": {
    "especie": "string",
    "raca": "string",
    "idade": "string", // Ex: "3 anos"
    "peso": "string" // Ex: "28 kg"
  },
  "sintomasFornecidos": ["string"],
  "observacoesFornecidas": "string",
  "sugestoesDiagnosticas": [
    {
      "condicao": "string",
      "probabilidadeEstimada": "Alta | Média | Baixa",
      "descricao": "string",
      "tratamentosSugeridos": ["string"],
      "nivelUrgencia": "Alto | Média | Baixo",
      "observacoesAdicionaisIA": "string"
    }
  ],
  "disclaimer": "Este é um sistema de auxílio ao diagnóstico baseado em Inteligência Artificial. As informações fornecidas são sugestões e NÃO substituem a avaliação, diagnóstico e tratamento por um médico veterinário qualificado. Sempre consulte um profissional para questões de saúde do seu animal."
}
```

### 1.6.4. Armazenamento e Disclaimer

*   **Armazenamento:** Conforme a lógica do backend, cada solicitação de diagnóstico e sua respectiva resposta da IA serão armazenadas na tabela `HistoricoDiagnosticosIA`. Isso permitirá que o usuário (tutor ou veterinário, dependendo das permissões) acesse o histórico de diagnósticos de IA para cada animal.
*   **Disclaimer:** O texto do disclaimer definido no `Response Body` acima será enviado junto com cada resposta da API. O frontend deverá exibir este disclaimer de forma clara e proeminente sempre que os resultados do diagnóstico da IA forem apresentados ao usuário. Uma sugestão é exibi-lo em uma seção destacada acima ou abaixo das sugestões diagnósticas.

Este detalhamento será usado para guiar a implementação do backend e frontend.
