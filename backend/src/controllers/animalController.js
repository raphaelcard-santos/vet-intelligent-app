const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Criar um novo Animal
const createAnimal = async (req, res) => {
  const { tutor_id, nome, especie, raca, data_nascimento, idade_aproximada_anos, idade_aproximada_meses, sexo, cor_pelagem, peso_kg, microchip_id, foto_url, observacoes } = req.body;

  if (!tutor_id || !nome || !especie) {
    return res.status(400).json({ message: "Campos obrigatórios não preenchidos: tutor_id, nome, especie." });
  }

  // TODO: Validar se o tutor_id existe na tabela Tutores.
  const animal_id = uuidv4();

  try {
    const novoAnimalQuery = `
      INSERT INTO Animais (animal_id, tutor_id, nome, especie, raca, data_nascimento, idade_aproximada_anos, idade_aproximada_meses, sexo, cor_pelagem, peso_kg, microchip_id, foto_url, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;
    const values = [animal_id, tutor_id, nome, especie, raca, data_nascimento, idade_aproximada_anos, idade_aproximada_meses, sexo, cor_pelagem, peso_kg, microchip_id, foto_url, observacoes];
    
    const result = await db.query(novoAnimalQuery, values);
    res.status(201).json({ message: "Animal criado com sucesso!", animal: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar animal:", error);
    if (error.code === "23503") { // Foreign key violation (tutor_id não existe)
        return res.status(400).json({ message: "Tutor de referência (tutor_id) não encontrado.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao criar animal.", error: error.message });
  }
};

// Obter todos os Animais (pode ser filtrado por tutor_id na query string)
const getAllAnimais = async (req, res) => {
  const { tutorId } = req.query; // Ex: /api/animais?tutorId=uuid-do-tutor
  try {
    let query = "SELECT a.*, t.nome_completo as nome_tutor FROM Animais a JOIN Tutores t ON a.tutor_id = t.tutor_id";
    const queryParams = [];
    if (tutorId) {
      query += " WHERE a.tutor_id = $1";
      queryParams.push(tutorId);
    }
    query += " ORDER BY a.nome;";
    
    const animais = await db.query(query, queryParams);
    res.status(200).json(animais.rows);
  } catch (error) {
    console.error("Erro ao buscar animais:", error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar animais.", error: error.message });
  }
};

// Obter um Animal específico pelo ID
const getAnimalById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = "SELECT a.*, t.nome_completo as nome_tutor FROM Animais a JOIN Tutores t ON a.tutor_id = t.tutor_id WHERE a.animal_id = $1";
    const animal = await db.query(query, [id]);
    if (animal.rows.length === 0) {
      return res.status(404).json({ message: "Animal não encontrado." });
    }
    res.status(200).json(animal.rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar animal com ID ${id}:`, error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar animal.", error: error.message });
  }
};

// Atualizar um Animal
const updateAnimal = async (req, res) => {
  const { id } = req.params;
  const { nome, especie, raca, data_nascimento, idade_aproximada_anos, idade_aproximada_meses, sexo, cor_pelagem, peso_kg, microchip_id, foto_url, observacoes } = req.body;

  // Não permitir alterar tutor_id por esta rota, para isso seria uma rota de "transferência"
  if (!nome && !especie && !raca && !data_nascimento && !idade_aproximada_anos && !idade_aproximada_meses && !sexo && !cor_pelagem && !peso_kg && !microchip_id && !foto_url && !observacoes) {
    return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
  }

  try {
    const updateQuery = `
      UPDATE Animais
      SET nome = COALESCE($1, nome),
          especie = COALESCE($2, especie),
          raca = COALESCE($3, raca),
          data_nascimento = COALESCE($4, data_nascimento),
          idade_aproximada_anos = COALESCE($5, idade_aproximada_anos),
          idade_aproximada_meses = COALESCE($6, idade_aproximada_meses),
          sexo = COALESCE($7, sexo),
          cor_pelagem = COALESCE($8, cor_pelagem),
          peso_kg = COALESCE($9, peso_kg),
          microchip_id = COALESCE($10, microchip_id),
          foto_url = COALESCE($11, foto_url),
          observacoes = COALESCE($12, observacoes),
          data_atualizacao = CURRENT_TIMESTAMP
      WHERE animal_id = $13
      RETURNING *;
    `;
    const values = [nome, especie, raca, data_nascimento, idade_aproximada_anos, idade_aproximada_meses, sexo, cor_pelagem, peso_kg, microchip_id, foto_url, observacoes, id];
    
    const result = await db.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Animal não encontrado para atualização." });
    }
    res.status(200).json({ message: "Animal atualizado com sucesso!", animal: result.rows[0] });
  } catch (error) {
    console.error(`Erro ao atualizar animal com ID ${id}:`, error);
    res.status(500).json({ message: "Erro interno do servidor ao atualizar animal.", error: error.message });
  }
};

// Deletar um Animal
const deleteAnimal = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM Animais WHERE animal_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Animal não encontrado para deleção." });
    }
    res.status(200).json({ message: "Animal deletado com sucesso!", animal_deletado: result.rows[0] });
  } catch (error) {
    console.error(`Erro ao deletar animal com ID ${id}:`, error);
     // Se houver FK constraints (ex: consultas referenciando animal), a deleção pode falhar.
    if (error.code === '23503') { // foreign_key_violation
        return res.status(409).json({ message: "Não é possível deletar o animal pois existem registros (consultas, etc.) associados a ele.", error: error.detail });
    }
    res.status(500).json({ message: "Erro interno do servidor ao deletar animal.", error: error.message });
  }
};

module.exports = {
  createAnimal,
  getAllAnimais,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
};

