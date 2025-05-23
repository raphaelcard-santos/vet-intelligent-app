const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // Supondo que você tenha um arquivo de configuração do banco de dados

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Em um ambiente real, você usaria jwt.verify e buscaria o usuário no banco
      // Para simulação, vamos apenas assumir que um token existe e é válido
      // e adicionar um usuário mock à requisição
      if (token === "SIMULATED_TOKEN") { // Este token é apenas para fins de teste local
        req.user = {
          id: "12345-simulated-user-id", // ID de usuário simulado
          // Adicione outros campos do usuário que possam ser necessários
        };
        next();
      } else {
        // Para outros tokens, ou se a validação real falhar:
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = await pool.query("SELECT usuario_id, email, tipo_usuario FROM Usuarios WHERE usuario_id = $1", [decoded.id]);
        // if(req.user.rows.length > 0) {
        //    req.user = req.user.rows[0];
        //    next();
        // } else {
        //    res.status(401);
        //    throw new Error("Não autorizado, usuário não encontrado");
        // }
        res.status(401);
        throw new Error("Não autorizado, token inválido ou expirado (simulação)");
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Não autorizado, token falhou");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Não autorizado, nenhum token fornecido");
  }
};

module.exports = { protect };

