const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Certifique-se que o caminho para db.js está correto

const JWT_SECRET = process.env.JWT_SECRET || "seuSuperSegredo"; // Use uma variável de ambiente para o segredo JWT

// Função para registrar um novo usuário
const registerUser = async (req, res) => {
  const { email, senha, tipo_usuario, nome_completo } = req.body; // Adicione outros campos conforme necessário (tutor_id_ref, etc.)

  if (!email || !senha || !tipo_usuario || !nome_completo) {
    return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos (email, senha, tipo_usuario, nome_completo)." });
  }

  try {
    // Verificar se o usuário já existe
    const userExists = await db.query("SELECT * FROM Usuarios WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: "Email já cadastrado." });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    // Inserir usuário no banco de dados
    // ATENÇÃO: Esta é uma inserção simplificada. Você precisará adaptar para inserir nas tabelas Tutores, Veterinarios, etc., e obter os IDs de referência.
    const newUserQuery = `
      INSERT INTO Usuarios (email, senha_hash, tipo_usuario) 
      VALUES ($1, $2, $3) RETURNING usuario_id, email, tipo_usuario;
    `;
    // Adicionar lógica para popular tabelas específicas (Tutores, Veterinarios, etc.) e obter os IDs para as colunas _ref
    // Por enquanto, vamos focar na tabela Usuarios.
    const newUser = await db.query(newUserQuery, [email, senha_hash, tipo_usuario]);

    // Gerar token JWT
    const token = jwt.sign({ usuario_id: newUser.rows[0].usuario_id, tipo_usuario: newUser.rows[0].tipo_usuario }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      token,
      usuario: {
        usuario_id: newUser.rows[0].usuario_id,
        email: newUser.rows[0].email,
        tipo_usuario: newUser.rows[0].tipo_usuario,
      },
    });

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor ao registrar usuário.", error: error.message });
  }
};

// Função para login de usuário
const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    // Verificar se o usuário existe
    const userResult = await db.query("SELECT * FROM Usuarios WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas (email não encontrado)." });
    }

    const usuario = userResult.rows[0];

    // Verificar a senha
    const isMatch = await bcrypt.compare(senha, usuario.senha_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais inválidas (senha incorreta)." });
    }

    // Gerar token JWT
    const token = jwt.sign({ usuario_id: usuario.usuario_id, tipo_usuario: usuario.tipo_usuario }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      usuario: {
        usuario_id: usuario.usuario_id,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
        // Adicionar outros dados do perfil do usuário conforme necessário
      },
    });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro interno do servidor ao fazer login.", error: error.message });
  }
};


// Simulação de uma busca no banco de dados (manter ou adaptar se necessário)
const getAllUsers = async (req, res) => {
  try {
    // Protegendo esta rota - exemplo, apenas admin poderia ver todos os usuários
    // A lógica de autorização (verificar tipo_usuario do token) viria aqui
    const users = await db.query("SELECT usuario_id, email, tipo_usuario, ativo, data_criacao FROM Usuarios ORDER BY data_criacao DESC");
    res.status(200).json(users.rows);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};

