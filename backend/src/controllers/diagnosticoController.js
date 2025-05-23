const { v4: uuidv4 } = require('uuid');

// Simulação de uma chamada à API da OpenAI (substituir pela chamada real quando a chave estiver disponível)
const simularChamadaOpenAI = async (prompt) => {
  console.log("Enviando prompt para OpenAI (simulado):", prompt);
  // Resposta simulada no formato esperado
  return {
    diagnosticos: [
      {
        condicao: "Gastroenterite Viral Canina (Simulada)",
        probabilidade_estimada: "Alta",
        descricao: "Inflamação do estômago e intestinos causada por um vírus. Comum em cães não vacinados.",
        tratamentos_sugeridos: [
          "Manter o animal hidratado com soro oral ou fluidoterapia intravenosa (em casos graves).",
          "Jejum alimentar por 12-24 horas, seguido de dieta leve e de fácil digestão (ex: frango cozido sem pele e arroz branco).",
          "Medicação sintomática para vômito e diarreia, conforme prescrição veterinária.",
          "Isolamento de outros cães para evitar contágio."
        ],
        nivel_urgencia: "Médio a Alto (dependendo da severidade dos sintomas e estado de hidratação)",
        observacoes_adicionais: "A vacinação é a principal forma de prevenção. Procurar um veterinário para confirmação e tratamento adequado."
      },
      {
        condicao: "Intoxicação Alimentar (Simulada)",
        probabilidade_estimada: "Média",
        descricao: "Ingestão de alimento contaminado ou inadequado para a espécie.",
        tratamentos_sugeridos: [
          "Indução do vômito (apenas se a ingestão foi recente e sob orientação veterinária).",
          "Carvão ativado para adsorver toxinas.",
          "Suporte com fluidoterapia e protetores gástricos."
        ],
        nivel_urgencia: "Médio",
        observacoes_adicionais: "Identificar e remover a fonte da intoxicação. Observar atentamente a evolução dos sintomas."
      }
    ]
  };
};

// Dados simulados para testes sem banco de dados
const animaisSimulados = {
  "1": {
    especie: "Cão",
    raca: "Labrador",
    idade: "3 anos",
    peso: "28 kg",
    historicoMedicoRelevante: "Vacinação em dia. Sem condições pré-existentes conhecidas."
  },
  "2": {
    especie: "Gato",
    raca: "Siamês",
    idade: "5 anos",
    peso: "4.5 kg",
    historicoMedicoRelevante: "Histórico de infecção urinária há 1 ano."
  },
  "3": {
    especie: "Ave",
    raca: "Calopsita",
    idade: "2 anos",
    peso: "90 g",
    historicoMedicoRelevante: "Sem histórico médico relevante."
  }
};

const obterDiagnosticoIA = async (req, res) => {
  const { animalId, sintomas, observacoesAdicionais } = req.body;
  const usuarioId = req.user?.id; // Supondo que o ID do usuário autenticado esteja em req.user.id

  if (!animalId || !sintomas || !Array.isArray(sintomas) || sintomas.length === 0) {
    return res.status(400).json({ message: 'Dados insuficientes para diagnóstico. animalId e sintomas são obrigatórios.' });
  }

  if (!usuarioId) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  try {
    // Usando dados simulados para testes sem banco de dados
    let animalInfo = animaisSimulados[animalId];
    
    // Se o animal não existe nos dados simulados
    if (!animalInfo) {
      return res.status(404).json({ message: 'Animal não encontrado ou não pertence ao usuário.' });
    }

    // 2. Construir o prompt para o GPT-4
    const prompt = `
      Você é um assistente de IA especializado em fornecer informações de auxílio ao diagnóstico veterinário. Seu objetivo é analisar os dados do animal e os sintomas fornecidos para sugerir possíveis condições, tratamentos iniciais e níveis de urgência. Suas sugestões NÃO substituem o diagnóstico de um veterinário profissional e devem sempre ser interpretadas como um auxílio informativo. Priorize sempre a segurança do animal. Se os sintomas indicarem uma emergência clara, destaque isso imediatamente. Evite fornecer dosagens exatas de medicamentos. Responda em formato JSON conforme o seguinte esquema: {"diagnosticos": [{"condicao": "string", "probabilidade_estimada": "Alta|Média|Baixa", "descricao": "string", "tratamentos_sugeridos": ["string"], "nivel_urgencia": "Alto|Média|Baixo", "observacoes_adicionais": "string"}]}

      Dados do Animal:
      - Espécie: ${animalInfo.especie}
      - Raça: ${animalInfo.raca}
      - Idade: ${animalInfo.idade}
      - Peso: ${animalInfo.peso || 'Não informado'}
      - Histórico: ${animalInfo.historicoMedicoRelevante || 'Nenhum histórico relevante informado.'}

      Sintomas Observados:
      ${sintomas.map(s => `- ${s}`).join('\n')}
      ${observacoesAdicionais ? `\nObservações Adicionais: ${observacoesAdicionais}` : ''}

      Com base nessas informações, forneça possíveis diagnósticos, incluindo probabilidade, descrição, tratamentos sugeridos, nível de urgência e observações adicionais, no formato JSON especificado.
    `;

    // 3. Enviar o prompt para a API do OpenAI GPT-4 (simulado por enquanto)
    const respostaLLMBruta = await simularChamadaOpenAI(prompt);

    // 4. Formatar a resposta para o frontend e definir o disclaimer
    const diagnosticoId = uuidv4();
    const dataHoraSolicitacao = new Date();
    const disclaimer = "Este é um sistema de auxílio ao diagnóstico baseado em Inteligência Artificial. As informações fornecidas são sugestões e NÃO substituem a avaliação, diagnóstico e tratamento por um médico veterinário qualificado. Sempre consulte um profissional para questões de saúde do seu animal.";

    const sugestoesProcessadas = {
      diagnosticoId,
      dataHora: dataHoraSolicitacao.toISOString(),
      animalInfo: {
        especie: animalInfo.especie,
        raca: animalInfo.raca,
        idade: animalInfo.idade,
        peso: animalInfo.peso
      },
      sintomasFornecidos: sintomas,
      observacoesFornecidas: observacoesAdicionais || '',
      sugestoesDiagnosticas: respostaLLMBruta.diagnosticos,
      disclaimer
    };

    // 5. Simular o salvamento dos dados (log apenas)
    console.log("Salvando no HistoricoDiagnosticosIA (simulado):", {
      id: diagnosticoId,
      animalId,
      usuarioId,
      dataHoraSolicitacao,
      dadosEntradaPrompt: { animalId, sintomas, observacoesAdicionais, animalInfoSnapshot: animalInfo },
      respostaLLMBruta,
      sugestoesProcessadas: sugestoesProcessadas.sugestoesDiagnosticas, // Apenas a parte relevante
      disclaimerExibido: disclaimer
    });

    // 6. Retornar a resposta formatada para o frontend
    res.status(200).json(sugestoesProcessadas);

  } catch (error) {
    console.error('Erro ao obter diagnóstico da IA:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao processar o diagnóstico.', error: error.message });
  }
};

module.exports = {
  obterDiagnosticoIA,
};

