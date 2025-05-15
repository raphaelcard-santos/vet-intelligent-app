const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Criar um novo Veterinário
const createVeterinario = async (req, res) => {
  const { usuario_id, nome_completo, cpf, crmv, especialidades, telefone_contato, email_contato, bio_curta, foto_perfil_url } = req.body;

  if (!usuario_id || !nome_completo || !crmv) {
    return res.status(400).json({ message: "Campos obrigatórios não preenchidos: usuario_id, nome_completo, crmv." });
  }

  // TODO: Validar se o usuario_id existe na tabela Usuarios e se já não está vinculado a outro perfil profissional.
  // TODO: Considerar transação para criar o veterinário e atualizar a referencia em Usuarios.veterinario_id_ref (ou similar)

  const veterinario_id = uuidv4();
  const especialidades_json = especialidades ? JSON.stringify(especialidades) : null;

  try {
    const novoVeterinarioQuery = `
      INSERT INTO Veterinarios (veterinario_id, usuario_id, nome_completo, cpf, crmv, especialidades, telefone_contato, email_contato, bio_curta, foto_perfil_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [veterinario_id, usuario_id, nome_completo, cpf, crmv, especialidades_json, telefone_contato, email_contato, bio_curta, foto_perfil_url];
    
    const result = await db.query(novoVeterinarioQuery, values);
    res.status(201).json({ message: "Veterinário criado com sucesso!", veterinario: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar veterinário:", error);
    if (error.code === "23503") { // Foreign key violation (usuario_id não existe)
        return res.status(400).json({ message: "Usuário de referência (usuario_id) não encontrado.", error: error.detail });
    }
    if (error.code === "23505") { // Unique constraint violation (cpf, crmv ou usuario_id já existe como veterinario)
        return res.status(409).json({ message: "Conflito de dados. CPF, CRMV ou usuário já pode estar associado a outro veterinário.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao criar veterinário.", error: error.message });
  }
};

// Obter todos os Veterinários
const getAllVeterinarios = async (req, res) => {
  try {
    const query = `
        SELECT v.*, u.email as usuario_email 
        FROM Veterinarios v
        LEFT JOIN Usuarios u ON v.usuario_id = u.usuario_id
        ORDER BY v.nome_completo;
    `;
    const veterinarios = await db.query(query);
    res.status(200).json(veterinarios.rows);
  } catch (error) {
    console.error("Erro ao buscar veterinários:", error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar veterinários.", error: error.message });
  }
};

// Obter um Veterinário específico pelo ID
const getVeterinarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
        SELECT v.*, u.email as usuario_email 
        FROM Veterinarios v
        LEFT JOIN Usuarios u ON v.usuario_id = u.usuario_id
        WHERE v.veterinario_id = $1;
    `;
    const veterinario = await db.query(query, [id]);
    if (veterinario.rows.length === 0) {
      return res.status(404).json({ message: "Veterinário não encontrado." });
    }
    res.status(200).json(veterinario.rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar veterinário com ID ${id}:`, error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar veterinário.", error: error.message });
  }
};

// Atualizar um Veterinário
const updateVeterinario = async (req, res) => {
  const { id } = req.params;
  const { nome_completo, cpf, crmv, especialidades, telefone_contato, email_contato, bio_curta, foto_perfil_url } = req.body;

  if (!nome_completo && !cpf && !crmv && !especialidades && !telefone_contato && !email_contato && !bio_curta && !foto_perfil_url) {
    return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
  }
  
  const especialidades_json = especialidades ? JSON.stringify(especialidades) : undefined; // undefined para COALESCE funcionar corretamente

  try {
    const updateQuery = `
      UPDATE Veterinarios
      SET nome_completo = COALESCE($1, nome_completo),
          cpf = COALESCE($2, cpf),
          crmv = COALESCE($3, crmv),
          especialidades = COALESCE($4, especialidades),
          telefone_contato = COALESCE($5, telefone_contato),
          email_contato = COALESCE($6, email_contato),
          bio_curta = COALESCE($7, bio_curta),
          foto_perfil_url = COALESCE($8, foto_perfil_url),
          data_atualizacao = CURRENT_TIMESTAMP
      WHERE veterinario_id = $9
      RETURNING *;
    `;
    const values = [nome_completo, cpf, crmv, especialidades_json, telefone_contato, email_contato, bio_curta, foto_perfil_url, id];
    
    const result = await db.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Veterinário não encontrado para atualização." });
    }
    res.status(200).json({ message: "Veterinário atualizado com sucesso!", veterinario: result.rows[0] });
  } catch (error) {
    console.error(`Erro ao atualizar veterinário com ID ${id}:`, error);
    if (error.code === "23505") { // Unique constraint violation (cpf ou crmv)
        return res.status(409).json({ message: "Conflito de dados. CPF ou CRMV já pode estar em uso.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao atualizar veterinário.", error: error.message });
  }
};

// Deletar um Veterinário
const deleteVeterinario = async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: Considerar o que acontece com consultas ou outros registros associados.
    const result = await db.query("DELETE FROM Veterinarios WHERE veterinario_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Veterinário não encontrado para deleção." });
    }
    res.status(200).json({ message: "Veterinário deletado com sucesso!", veterinario_deletado: result.rows[0] });
  } catch (error) {
    console.error(`Erro ao deletar veterinário com ID ${id}:`, error);
    if (error.code === '23503') { // foreign_key_violation
        return res.status(409).json({ message: "Não é possível deletar o veterinário pois existem registros (consultas, etc.) associados a ele.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao deletar veterinário.", error: error.message });
  }
};

module.exports = {
  createVeterinario,
  getAllVeterinarios,
  getVeterinarioById,
  updateVeterinario,
  deleteVeterinario,
};

