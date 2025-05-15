const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Criar uma nova Clínica
const createClinica = async (req, res) => {
  const { nome_fantasia, razao_social, cnpj, endereco_completo, telefone_principal, email_principal, horario_atendimento, servicos_oferecidos, responsavel_tecnico_id, foto_fachada_url, website, observacoes } = req.body;

  if (!nome_fantasia || !cnpj) {
    return res.status(400).json({ message: "Campos obrigatórios não preenchidos: nome_fantasia, cnpj." });
  }

  const clinica_id = uuidv4();
  const servicos_json = servicos_oferecidos ? JSON.stringify(servicos_oferecidos) : null;

  try {
    const novaClinicaQuery = `
      INSERT INTO Clinicas (clinica_id, nome_fantasia, razao_social, cnpj, endereco_completo, telefone_principal, email_principal, horario_atendimento, servicos_oferecidos, responsavel_tecnico_id, foto_fachada_url, website, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const values = [clinica_id, nome_fantasia, razao_social, cnpj, endereco_completo, telefone_principal, email_principal, horario_atendimento, servicos_json, responsavel_tecnico_id, foto_fachada_url, website, observacoes];
    
    const result = await db.query(novaClinicaQuery, values);
    res.status(201).json({ message: "Clínica criada com sucesso!", clinica: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar clínica:", error);
    if (error.code === "23503" && error.constraint === "clinicas_responsavel_tecnico_id_fkey") { // Foreign key violation (responsavel_tecnico_id não existe em Veterinarios)
        return res.status(400).json({ message: "Veterinário responsável técnico (responsavel_tecnico_id) não encontrado.", error: error.detail });
    }
    if (error.code === "23505") { // Unique constraint violation (cnpj já existe)
        return res.status(409).json({ message: "Conflito de dados. CNPJ já pode estar cadastrado.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao criar clínica.", error: error.message });
  }
};

// Obter todas as Clínicas
const getAllClinicas = async (req, res) => {
  try {
    const query = `SELECT * FROM Clinicas ORDER BY nome_fantasia;`;
    const clinicas = await db.query(query);
    res.status(200).json(clinicas.rows);
  } catch (error) {
    console.error("Erro ao buscar clínicas:", error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar clínicas.", error: error.message });
  }
};

// Obter uma Clínica específica pelo ID
const getClinicaById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM Clinicas WHERE clinica_id = $1;`;
    const clinica = await db.query(query, [id]);
    if (clinica.rows.length === 0) {
      return res.status(404).json({ message: "Clínica não encontrada." });
    }
    res.status(200).json(clinica.rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar clínica com ID ${id}:`, error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar clínica.", error: error.message });
  }
};

// Atualizar uma Clínica
const updateClinica = async (req, res) => {
  const { id } = req.params;
  const { nome_fantasia, razao_social, cnpj, endereco_completo, telefone_principal, email_principal, horario_atendimento, servicos_oferecidos, responsavel_tecnico_id, foto_fachada_url, website, observacoes } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
  }

  const servicos_json = servicos_oferecidos ? JSON.stringify(servicos_oferecidos) : undefined;

  try {
    const updateQuery = `
      UPDATE Clinicas
      SET nome_fantasia = COALESCE($1, nome_fantasia),
          razao_social = COALESCE($2, razao_social),
          cnpj = COALESCE($3, cnpj),
          endereco_completo = COALESCE($4, endereco_completo),
          telefone_principal = COALESCE($5, telefone_principal),
          email_principal = COALESCE($6, email_principal),
          horario_atendimento = COALESCE($7, horario_atendimento),
          servicos_oferecidos = COALESCE($8, servicos_oferecidos),
          responsavel_tecnico_id = COALESCE($9, responsavel_tecnico_id),
          foto_fachada_url = COALESCE($10, foto_fachada_url),
          website = COALESCE($11, website),
          observacoes = COALESCE($12, observacoes),
          data_atualizacao = CURRENT_TIMESTAMP
      WHERE clinica_id = $13
      RETURNING *;
    `;
    const values = [nome_fantasia, razao_social, cnpj, endereco_completo, telefone_principal, email_principal, horario_atendimento, servicos_json, responsavel_tecnico_id, foto_fachada_url, website, observacoes, id];
    
    const result = await db.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Clínica não encontrada para atualização." });
    }
    res.status(200).json({ message: "Clínica atualizada com sucesso!", clinica: result.rows[0] });
  } catch (error) {
    console.error(`Erro ao atualizar clínica com ID ${id}:`, error);
    if (error.code === "23503" && error.constraint === "clinicas_responsavel_tecnico_id_fkey") { 
        return res.status(400).json({ message: "Veterinário responsável técnico (responsavel_tecnico_id) não encontrado.", error: error.detail });
    }
    if (error.code === "23505") { // Unique constraint violation (cnpj)
        return res.status(409).json({ message: "Conflito de dados. CNPJ já pode estar em uso.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao atualizar clínica.", error: error.message });
  }
};

// Deletar uma Clínica
const deleteClinica = async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: Considerar o que acontece com associações em ClinicasVeterinarios.
    // Idealmente, deletar as associações primeiro ou usar ON DELETE CASCADE na FK.
    await db.query("DELETE FROM ClinicasVeterinarios WHERE clinica_id = $1", [id]); // Exemplo de deleção em cascata manual
    const result = await db.query("DELETE FROM Clinicas WHERE clinica_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Clínica não encontrada para deleção." });
    }
    res.status(200).json({ message: "Clínica deletada com sucesso!", clinica_deletada: result.rows[0] });
  } catch (error) {
    console.error(`Erro ao deletar clínica com ID ${id}:`, error);
     if (error.code === '23503') { // foreign_key_violation, ex: se houver consultas ligadas diretamente à clínica (improvável no modelo atual)
        return res.status(409).json({ message: "Não é possível deletar a clínica pois existem registros (consultas, etc.) associados a ela.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao deletar clínica.", error: error.message });
  }
};

// Adicionar/Associar um veterinário a uma clínica
const addVeterinarioToClinica = async (req, res) => {
    const { clinicaId, veterinarioId } = req.params;
    const associacao_id = uuidv4();
    try {
        // Verificar se clínica e veterinário existem
        const clinicaExists = await db.query("SELECT 1 FROM Clinicas WHERE clinica_id = $1", [clinicaId]);
        const veterinarioExists = await db.query("SELECT 1 FROM Veterinarios WHERE veterinario_id = $1", [veterinarioId]);

        if (clinicaExists.rows.length === 0) {
            return res.status(404).json({ message: "Clínica não encontrada." });
        }
        if (veterinarioExists.rows.length === 0) {
            return res.status(404).json({ message: "Veterinário não encontrado." });
        }

        const query = `
            INSERT INTO ClinicasVeterinarios (associacao_id, clinica_id, veterinario_id)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await db.query(query, [associacao_id, clinicaId, veterinarioId]);
        res.status(201).json({ message: "Veterinário associado à clínica com sucesso!", associacao: result.rows[0] });
    } catch (error) {
        console.error(`Erro ao associar veterinário ${veterinarioId} à clínica ${clinicaId}:`, error);
        if (error.code === "23505") { // Unique constraint violation (associação já existe)
            return res.status(409).json({ message: "Este veterinário já está associado a esta clínica.", error: error.detail });
        }
        res.status(500).json({ message: "Erro interno do servidor ao associar veterinário à clínica.", error: error.message });
    }
};

// Remover/Desassociar um veterinário de uma clínica
const removeVeterinarioFromClinica = async (req, res) => {
    const { clinicaId, veterinarioId } = req.params;
    try {
        const result = await db.query("DELETE FROM ClinicasVeterinarios WHERE clinica_id = $1 AND veterinario_id = $2 RETURNING *", [clinicaId, veterinarioId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Associação entre veterinário e clínica não encontrada para deleção." });
        }
        res.status(200).json({ message: "Veterinário desassociado da clínica com sucesso!", associacao_deletada: result.rows[0] });
    } catch (error) {
        console.error(`Erro ao desassociar veterinário ${veterinarioId} da clínica ${clinicaId}:`, error);
        res.status(500).json({ message: "Erro interno do servidor ao desassociar veterinário da clínica.", error: error.message });
    }
};

// Listar todos os veterinários de uma clínica específica
const getVeterinariosByClinicaId = async (req, res) => {
    const { clinicaId } = req.params;
    try {
        const query = `
            SELECT v.*, u.email as usuario_email
            FROM Veterinarios v
            JOIN Usuarios u ON v.usuario_id = u.usuario_id
            JOIN ClinicasVeterinarios cv ON v.veterinario_id = cv.veterinario_id
            WHERE cv.clinica_id = $1
            ORDER BY v.nome_completo;
        `;
        const veterinarios = await db.query(query, [clinicaId]);
        if (veterinarios.rows.length === 0) {
            // Não é um erro, apenas pode não haver veterinários associados
            // return res.status(404).json({ message: "Nenhum veterinário encontrado para esta clínica ou clínica não existe." });
        }
        res.status(200).json(veterinarios.rows);
    } catch (error) {
        console.error(`Erro ao listar veterinários da clínica ${clinicaId}:`, error);
        res.status(500).json({ message: "Erro interno do servidor ao listar veterinários da clínica.", error: error.message });
    }
};


module.exports = {
  createClinica,
  getAllClinicas,
  getClinicaById,
  updateClinica,
  deleteClinica,
  addVeterinarioToClinica,
  removeVeterinarioFromClinica,
  getVeterinariosByClinicaId,
};

