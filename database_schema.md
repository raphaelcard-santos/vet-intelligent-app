## Esquema do Banco de Dados - Vet Intelligent App

Este documento descreve a estrutura proposta para o banco de dados do aplicativo Vet Intelligent App. A tecnologia de banco de dados sugerida é PostgreSQL.

### 1. Tabela: `Usuarios`
Responsável por armazenar informações de autenticação e o tipo de cada usuário no sistema.

- `usuario_id` (UUID, PK) - Identificador único do usuário.
- `email` (VARCHAR(255), UNIQUE, NOT NULL) - Email para login.
- `senha_hash` (VARCHAR(255), NOT NULL) - Hash da senha do usuário.
- `tipo_usuario` (VARCHAR(50), NOT NULL) - Tipo de usuário (ex: 'tutor', 'veterinario', 'estudante', 'clinica_admin').
- `ativo` (BOOLEAN, DEFAULT TRUE) - Indica se a conta está ativa.
- `email_verificado` (BOOLEAN, DEFAULT FALSE) - Indica se o email foi verificado.
- `data_criacao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP) - Data de criação do registro.
- `ultimo_login` (TIMESTAMP) - Data do último login.
- `tutor_id_ref` (UUID, FK para `Tutores.tutor_id`, NULLABLE) - Referência se o usuário for um tutor.
- `veterinario_id_ref` (UUID, FK para `Veterinarios.veterinario_id`, NULLABLE) - Referência se o usuário for um veterinário.
- `estudante_id_ref` (UUID, FK para `Estudantes.estudante_id`, NULLABLE) - Referência se o usuário for um estudante.
- `clinica_id_ref` (UUID, FK para `Clinicas.clinica_id`, NULLABLE) - Referência se o usuário for admin de uma clínica.

### 2. Tabela: `Tutores`
Armazena informações sobre os tutores dos animais.

- `tutor_id` (UUID, PK) - Identificador único do tutor.
- `usuario_id` (UUID, FK para `Usuarios.usuario_id`, UNIQUE, NOT NULL) - Referência ao usuário correspondente.
- `nome_completo` (VARCHAR(255), NOT NULL) - Nome completo do tutor.
- `cpf` (VARCHAR(14), UNIQUE, NULLABLE) - CPF do tutor (formato XXX.XXX.XXX-XX).
- `telefone_principal` (VARCHAR(20), NOT NULL) - Telefone principal de contato.
- `telefone_secundario` (VARCHAR(20), NULLABLE) - Telefone secundário.
- `endereco_rua` (VARCHAR(255), NULLABLE)
- `endereco_numero` (VARCHAR(50), NULLABLE)
- `endereco_complemento` (VARCHAR(100), NULLABLE)
- `endereco_bairro` (VARCHAR(100), NULLABLE)
- `endereco_cidade` (VARCHAR(100), NULLABLE)
- `endereco_estado` (VARCHAR(2), NULLABLE) - Sigla do estado (UF).
- `endereco_cep` (VARCHAR(9), NULLABLE) - CEP (formato XXXXX-XXX).
- `data_cadastro` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `data_atualizacao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 3. Tabela: `Animais`
Informações sobre os animais cadastrados.

- `animal_id` (UUID, PK) - Identificador único do animal.
- `tutor_id` (UUID, FK para `Tutores.tutor_id`, NOT NULL) - Tutor responsável pelo animal.
- `nome` (VARCHAR(100), NOT NULL) - Nome do animal.
- `especie` (VARCHAR(50), NOT NULL) - Espécie (ex: Cão, Gato).
- `raca` (VARCHAR(50), NULLABLE) - Raça do animal.
- `data_nascimento` (DATE, NULLABLE) - Data de nascimento.
- `idade_aproximada_anos` (INTEGER, NULLABLE) - Idade aproximada em anos, se data_nascimento não for conhecida.
- `idade_aproximada_meses` (INTEGER, NULLABLE) - Idade aproximada em meses.
- `sexo` (VARCHAR(10), NULLABLE) - Sexo (Macho, Fêmea).
- `cor_pelagem` (VARCHAR(50), NULLABLE) - Cor da pelagem.
- `peso_kg` (DECIMAL(5,2), NULLABLE) - Peso em quilogramas.
- `microchip_id` (VARCHAR(100), NULLABLE) - Número do microchip.
- `foto_url` (VARCHAR(2048), NULLABLE) - URL da foto do animal.
- `observacoes` (TEXT, NULLABLE) - Observações gerais sobre o animal.
- `data_cadastro` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `data_atualizacao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 4. Tabela: `Veterinarios`
Informações sobre os médicos veterinários.

- `veterinario_id` (UUID, PK) - Identificador único do veterinário.
- `usuario_id` (UUID, FK para `Usuarios.usuario_id`, UNIQUE, NOT NULL) - Referência ao usuário correspondente.
- `nome_completo` (VARCHAR(255), NOT NULL) - Nome completo.
- `crmv` (VARCHAR(20), UNIQUE, NOT NULL) - Número do Conselho Regional de Medicina Veterinária.
- `crmv_estado` (VARCHAR(2), NOT NULL) - Estado de emissão do CRMV.
- `especialidades` (JSONB, NULLABLE) - Lista de especialidades (ex: ['Cardiologia', 'Dermatologia']).
- `telefone_contato` (VARCHAR(20), NULLABLE)
- `email_contato` (VARCHAR(255), NULLABLE) - Email profissional, pode ser diferente do de login.
- `foto_perfil_url` (VARCHAR(2048), NULLABLE)
- `data_cadastro` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `data_atualizacao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 5. Tabela: `Clinicas`
Informações sobre as clínicas veterinárias.

- `clinica_id` (UUID, PK) - Identificador único da clínica.
- `nome_fantasia` (VARCHAR(255), NOT NULL)
- `razao_social` (VARCHAR(255), NULLABLE)
- `cnpj` (VARCHAR(18), UNIQUE, NULLABLE) - CNPJ (formato XX.XXX.XXX/XXXX-XX).
- `crmv_pj` (VARCHAR(20), NULLABLE) - CRMV da Pessoa Jurídica.
- `email_contato` (VARCHAR(255), NOT NULL)
- `telefone_principal` (VARCHAR(20), NOT NULL)
- `endereco_rua` (VARCHAR(255), NOT NULL)
- `endereco_numero` (VARCHAR(50), NOT NULL)
- `endereco_complemento` (VARCHAR(100), NULLABLE)
- `endereco_bairro` (VARCHAR(100), NOT NULL)
- `endereco_cidade` (VARCHAR(100), NOT NULL)
- `endereco_estado` (VARCHAR(2), NOT NULL)
- `endereco_cep` (VARCHAR(9), NOT NULL)
- `logo_url` (VARCHAR(2048), NULLABLE)
- `horario_funcionamento` (TEXT, NULLABLE)
- `data_cadastro` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `data_atualizacao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 6. Tabela: `Veterinarios_Clinicas` (Associação N-N)
Associa veterinários a clínicas.

- `veterinario_id` (UUID, FK para `Veterinarios.veterinario_id`, NOT NULL)
- `clinica_id` (UUID, FK para `Clinicas.clinica_id`, NOT NULL)
- `cargo_funcao` (VARCHAR(100), NULLABLE) - Cargo do veterinário na clínica.
- `data_associacao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- PRIMARY KEY (`veterinario_id`, `clinica_id`)

### 7. Tabela: `Estudantes`
Informações sobre os estudantes de veterinária.

- `estudante_id` (UUID, PK) - Identificador único do estudante.
- `usuario_id` (UUID, FK para `Usuarios.usuario_id`, UNIQUE, NOT NULL) - Referência ao usuário correspondente.
- `nome_completo` (VARCHAR(255), NOT NULL)
- `instituicao_ensino` (VARCHAR(255), NOT NULL)
- `curso` (VARCHAR(100), DEFAULT 'Medicina Veterinária')
- `periodo_semestre` (VARCHAR(20), NULLABLE) - Período ou semestre atual.
- `matricula` (VARCHAR(50), NULLABLE) - Número de matrícula.
- `data_cadastro` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `data_atualizacao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 8. Tabela: `Consultas_Atendimentos` (Histórico Médico)
Registros de consultas, vacinas, exames, etc.

- `atendimento_id` (UUID, PK) - Identificador único do atendimento.
- `animal_id` (UUID, FK para `Animais.animal_id`, NOT NULL)
- `veterinario_id` (UUID, FK para `Veterinarios.veterinario_id`, NULLABLE) - Veterinário que realizou o atendimento.
- `clinica_id` (UUID, FK para `Clinicas.clinica_id`, NULLABLE) - Clínica onde ocorreu o atendimento.
- `tutor_id_responsavel` (UUID, FK para `Tutores.tutor_id`, NOT NULL) - Tutor que acompanhou/registrou.
- `data_atendimento` (TIMESTAMP, NOT NULL)
- `tipo_atendimento` (VARCHAR(100), NOT NULL) - Ex: 'Consulta Clínica', 'Vacinação', 'Exame Laboratorial', 'Cirurgia', 'Registro de Sintomas (IA)', 'Diagnóstico por IA'.
- `sintomas_observados` (TEXT, NULLABLE)
- `diagnostico_presuntivo` (TEXT, NULLABLE)
- `diagnostico_definitivo` (TEXT, NULLABLE)
- `tratamento_prescrito` (TEXT, NULLABLE)
- `exames_solicitados_resultados` (JSONB, NULLABLE) - Estrutura para exames e seus resultados.
- `peso_kg_dia` (DECIMAL(5,2), NULLABLE) - Peso do animal no dia do atendimento.
- `temperatura_celsius_dia` (DECIMAL(4,1), NULLABLE) - Temperatura do animal.
- `observacoes_adicionais` (TEXT, NULLABLE)
- `arquivos_anexos_urls` (JSONB, NULLABLE) - Lista de URLs de arquivos anexos (exames, imagens).
- `data_criacao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `data_atualizacao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 9. Tabela: `Diagnosticos_IA`
Armazena as interações e resultados do sistema de diagnóstico por IA.

- `diagnostico_ia_id` (UUID, PK) - Identificador único da interação com IA.
- `atendimento_id` (UUID, FK para `Consultas_Atendimentos.atendimento_id`, NULLABLE) - Se a IA foi usada dentro de um atendimento formal.
- `animal_id` (UUID, FK para `Animais.animal_id`, NULLABLE) - Animal para o qual o diagnóstico foi solicitado.
- `usuario_id_solicitante` (UUID, FK para `Usuarios.usuario_id`, NOT NULL) - Usuário que solicitou o diagnóstico.
- `sintomas_input_texto` (TEXT, NOT NULL) - Sintomas fornecidos pelo usuário.
- `sintomas_input_estruturado` (JSONB, NULLABLE) - Sintomas em formato estruturado, se aplicável.
- `resultado_ia_bruto` (JSONB, NULLABLE) - Resposta completa da API de IA.
- `diagnosticos_sugeridos_ia` (JSONB, NULLABLE) - Lista de diagnósticos sugeridos com probabilidades (ex: `[{"diagnostico": "Doença X", "probabilidade": 0.85}, ...]`).
- `tratamentos_sugeridos_ia` (JSONB, NULLABLE) - Lista de tratamentos sugeridos.
- `exames_recomendados_ia` (JSONB, NULLABLE) - Lista de exames recomendados pela IA.
- `feedback_usuario_utilidade` (VARCHAR(20), NULLABLE) - Feedback do usuário (ex: 'muito_util', 'util', 'pouco_util', 'inutil').
- `feedback_usuario_comentario` (TEXT, NULLABLE) - Comentários adicionais do usuário.
- `data_solicitacao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

Este esquema é uma proposta inicial e pode ser refinado conforme o desenvolvimento do projeto.
