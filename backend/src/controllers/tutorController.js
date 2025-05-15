const db = require("../config/db");
const { v4: uuidv4 } = require("uuid"); // Para gerar UUIDs se não forem gerados pelo DB automaticamente

// Criar um novo Tutor
const createTutor = async (req, res) => {
  const { usuario_id, nome_completo, cpf, telefone_principal, telefone_secundario, endereco_rua, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep } = req.body;

  if (!usuario_id || !nome_completo || !telefone_principal) {
    return res.status(400).json({ message: "Campos obrigatórios não preenchidos: usuario_id, nome_completo, telefone_principal." });
  }

  // TODO: Validar se o usuario_id existe na tabela Usuarios e se já não está vinculado a outro tutor.
  // TODO: Considerar transação para criar o tutor e atualizar a referencia em Usuarios.tutor_id_ref

  const tutor_id = uuidv4(); // Gerar UUID para o novo tutor

  try {
    const novoTutorQuery = `
      INSERT INTO Tutores (tutor_id, usuario_id, nome_completo, cpf, telefone_principal, telefone_secundario, endereco_rua, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const values = [tutor_id, usuario_id, nome_completo, cpf, telefone_principal, telefone_secundario, endereco_rua, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep];
    
    const result = await db.query(novoTutorQuery, values);
    
    // Opcional: Atualizar Usuarios.tutor_id_ref (idealmente em uma transação)
    // await db.query("UPDATE Usuarios SET tutor_id_ref = $1 WHERE usuario_id = $2", [tutor_id, usuario_id]);

    res.status(201).json({ message: "Tutor criado com sucesso!", tutor: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar tutor:", error);
    if (error.code === "23503") { // Foreign key violation (usuario_id não existe)
        return res.status(400).json({ message: "Usuário de referência (usuario_id) não encontrado.", error: error.detail });
    }
    if (error.code === "23505") { // Unique constraint violation (cpf ou usuario_id já existe como tutor)
        return res.status(409).json({ message: "Conflito de dados. CPF ou usuário já pode estar associado a outro tutor.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao criar tutor.", error: error.message });
  }
};

// Obter todos os Tutores
const getAllTutores = async (req, res) => {
  try {
    // Adicionar JOIN com Usuarios para buscar o email, por exemplo.
    const query = `
        SELECT t.*, u.email as usuario_email 
        FROM Tutores t
        LEFT JOIN Usuarios u ON t.usuario_id = u.usuario_id
        ORDER BY t.nome_completo;
    `;
    const tutores = await db.query(query);
    res.status(200).json(tutores.rows);
  } catch (error) {
    console.error("Erro ao buscar tutores:", error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar tutores.", error: error.message });
  }
};

// Obter um Tutor específico pelo ID
const getTutorById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
        SELECT t.*, u.email as usuario_email 
        FROM Tutores t
        LEFT JOIN Usuarios u ON t.usuario_id = u.usuario_id
        WHERE t.tutor_id = $1;
    `;
    const tutor = await db.query(query, [id]);
    if (tutor.rows.length === 0) {
      return res.status(404).json({ message: "Tutor não encontrado." });
    }
    res.status(200).json(tutor.rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar tutor com ID ${id}:`, error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar tutor.", error: error.message });
  }
};

// Atualizar um Tutor
const updateTutor = async (req, res) => {
  const { id } = req.params;
  const { nome_completo, cpf, telefone_principal, telefone_secundario, endereco_rua, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep } = req.body;

  if (!nome_completo && !cpf && !telefone_principal && !telefone_secundario && !endereco_rua && !endereco_numero && !endereco_complemento && !endereco_bairro && !endereco_cidade && !endereco_estado && !endereco_cep) {
    return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
  }

  try {
    // Construir a query de atualização dinamicamente pode ser mais flexível
    // Por simplicidade, vamos atualizar todos os campos fornecidos (exceto usuario_id que não deve mudar aqui)
    const updateQuery = `
      UPDATE Tutores
      SET nome_completo = COALESCE($1, nome_completo),
          cpf = COALESCE($2, cpf),
          telefone_principal = COALESCE($3, telefone_principal),
          telefone_secundario = COALESCE($4, telefone_secundario),
          endereco_rua = COALESCE($5, endereco_rua),
          endereco_numero = COALESCE($6, endereco_numero),
          endereco_complemento = COALESCE($7, endereco_complemento),
          endereco_bairro = COALESCE($8, endereco_bairro),
          endereco_cidade = COALESCE($9, endereco_cidade),
          endereco_estado = COALESCE($10, endereco_estado),
          endereco_cep = COALESCE($11, endereco_cep),
          data_atualizacao = CURRENT_TIMESTAMP
      WHERE tutor_id = $12
      RETURNING *;
    `;
    const values = [nome_completo, cpf, telefone_principal, telefone_secundario, endereco_rua, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep, id];
    
    const result = await db.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tutor não encontrado para atualização." });
    }
    res.status(200).json({ message: "Tutor atualizado com sucesso!", tutor: result.rows[0] });
  } catch (error) {
    console.error(`Erro ao atualizar tutor com ID ${id}:`, error);
     if (error.code === "23505") { // Unique constraint violation (cpf)
        return res.status(409).json({ message: "Conflito de dados. CPF já pode estar em uso.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao atualizar tutor.", error: error.message });
  }
};

// Deletar um Tutor
const deleteTutor = async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: Considerar o que acontece com os animais associados (ex: deletar em cascata ou impedir deleção se houver animais).
    // TODO: Considerar o que acontece com o usuário (desassociar tutor_id_ref ou deletar usuário se não tiver outros papéis).
    // Por agora, uma deleção simples:
    const result = await db.query("DELETE FROM Tutores WHERE tutor_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tutor não encontrado para deleção." });
    }
    // Opcional: Limpar Usuarios.tutor_id_ref
    // await db.query("UPDATE Usuarios SET tutor_id_ref = NULL WHERE tutor_id_ref = $1", [id]);

    res.status(200).json({ message: "Tutor deletado com sucesso!", tutor_deletado: result.rows[0] });
  } catch (error) {
    console.error(`Erro ao deletar tutor com ID ${id}:`, error);
    // Se houver FK constraints (ex: animais referenciando tutor), a deleção pode falhar.
    if (error.code === '23503') { // foreign_key_violation
        return res.status(409).json({ message: "Não é possível deletar o tutor pois existem animais associados a ele.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao deletar tutor.", error: error.message });
  }
};

module.exports = {
  createTutor,
  getAllTutores,
  getTutorById,
  updateTutor,
  deleteTutor,
};

