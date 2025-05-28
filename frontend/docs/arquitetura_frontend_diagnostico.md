# Arquitetura Frontend - Diagnóstico com IA

Este documento descreve a arquitetura planejada para as telas e componentes do frontend responsáveis pela funcionalidade de diagnóstico com Inteligência Artificial no aplicativo Vet Intelligent App, baseada nas [recomendações de UX/UI](./ux_ui_diagnostico_recomendacoes.md).

## 1. Telas Principais

Serão criadas duas novas telas principais para este fluxo:

1.  **`DiagnosticoInputScreen`**: Tela onde o usuário (tutor ou veterinário) seleciona o animal, insere os sintomas observados e adiciona observações.
2.  **`DiagnosticoResultScreen`**: Tela que exibe as sugestões de diagnóstico retornadas pela API, incluindo condições, tratamentos, urgência e o disclaimer obrigatório.

## 2. Componentes Reutilizáveis

Para construir as telas, serão desenvolvidos os seguintes componentes reutilizáveis:

*   **`AnimalSelector`**: (Pode já existir ou ser adaptado) Componente para selecionar o animal para o qual o diagnóstico será solicitado. Exibirá informações básicas do animal selecionado.
*   **`SymptomInput`**: Componente para a entrada de sintomas. Poderá incluir:
    *   Uma lista pesquisável/selecionável de sintomas comuns.
    *   Um campo de texto para adicionar sintomas não listados ou descrições livres.
    *   Um campo de texto para observações adicionais.
*   **`LoadingIndicator`**: Componente para exibir feedback visual enquanto a API está sendo processada.
*   **`ResultCard`**: Componente para exibir cada sugestão de diagnóstico individualmente, contendo:
    *   Condição suspeita.
    *   Probabilidade estimada.
    *   Descrição.
    *   Lista de tratamentos sugeridos.
    *   Nível de urgência (com possível indicador visual).
    *   Observações adicionais da IA.
*   **`DisclaimerBanner`**: Componente para exibir o aviso legal de forma clara e destacada na tela de resultados.
*   **`ErrorDisplay`**: Componente para exibir mensagens de erro de forma amigável caso a API falhe.

## 3. Fluxo de Navegação

1.  **Ponto de Entrada:** Um botão "Iniciar Diagnóstico por IA" (ou similar) será adicionado na tela de detalhes do animal (`AnimalDetailScreen`).
2.  **Navegação:** Ao clicar no botão, o usuário será navegado para a `DiagnosticoInputScreen`, passando o ID do animal como parâmetro.
3.  **Submissão:** Após preencher os dados na `DiagnosticoInputScreen` e submeter, a navegação ocorrerá para a `DiagnosticoResultScreen`, passando os resultados da API como parâmetro (ou buscando-os com base em um ID de diagnóstico, se a API for modificada para retornar um ID primeiro).
4.  **Retorno:** Da `DiagnosticoResultScreen`, o usuário poderá voltar para a tela de detalhes do animal ou para a tela anterior no stack de navegação.

*   **Navegador:** Estas telas serão integradas a um novo Stack Navigator específico para o fluxo de diagnóstico, que pode ser acessado a partir do `AnimalNavigator`.

## 4. Gerenciamento de Estado e Fluxo de Dados

*   **Estado Local:** Para as telas de Input e Resultado, o estado local (useState) será utilizado para gerenciar os dados do formulário (sintomas, observações), o estado de carregamento (loading) e os resultados da API.
*   **`apiClient`:** A chamada à API `/api/diagnostico` será encapsulada em uma função dentro do `frontend/src/services/apiClient.js`.
*   **Passagem de Dados:**
    *   O `animalId` será passado como parâmetro de navegação para a `DiagnosticoInputScreen`.
    *   Os dados da API (resposta completa) serão passados como parâmetro de navegação para a `DiagnosticoResultScreen`.
*   **Autenticação:** O `apiClient` já deve lidar com a inclusão do token de autenticação nas requisições (usando o token simulado `SIMULATED_TOKEN` por enquanto).

## 5. Estrutura de Arquivos (Proposta)

```
vet-intelligent-app/
└── frontend/
    ├── src/
    │   ├── screens/
    │   │   └── DiagnosticoScreens/
    │   │       ├── DiagnosticoInputScreen.js
    │   │       └── DiagnosticoResultScreen.js
    │   ├── components/
    │   │   ├── Diagnostico/
    │   │   │   ├── SymptomInput.js
    │   │   │   ├── ResultCard.js
    │   │   │   ├── DisclaimerBanner.js
    │   │   │   └── ... (outros componentes específicos)
    │   │   └── shared/ (componentes como LoadingIndicator, ErrorDisplay, se não existirem)
    │   ├── navigation/
    │   │   ├── DiagnosticoNavigator.js (novo stack)
    │   │   └── AppNavigator.js (modificado para incluir o DiagnosticoNavigator)
    │   ├── services/
    │   │   └── apiClient.js (modificado para incluir a função da API de diagnóstico)
    │   └── ...
    └── docs/
        ├── ux_ui_diagnostico_recomendacoes.md (já criado)
        └── arquitetura_frontend_diagnostico.md (este arquivo)
```

## Próximos Passos

1.  Criar a estrutura de pastas e arquivos proposta.
2.  Implementar a `DiagnosticoInputScreen` e seus componentes associados.
3.  Integrar a chamada à API no `apiClient` e na `DiagnosticoInputScreen`.
4.  Implementar a `DiagnosticoResultScreen` e seus componentes.
5.  Criar e integrar o `DiagnosticoNavigator`.
6.  Adicionar o ponto de entrada na `AnimalDetailScreen`.
7.  Realizar testes e validações do fluxo completo.
8.  Commit e push dos arquivos para o repositório.

