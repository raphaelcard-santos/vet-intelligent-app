const express = require("express");
const dotenv = require("dotenv");

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para parsear JSON
app.use(express.json());

// Importa rotas
const userRoutes = require("./src/routes/userRoutes");
const tutorRoutes = require("./src/routes/tutorRoutes");
const animalRoutes = require("./src/routes/animalRoutes");
const veterinarioRoutes = require("./src/routes/veterinarioRoutes"); // Adiciona rotas de veterinários

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend do Vet Intelligent App está funcionando!");
});

// Define o prefixo para as rotas da API
app.use("/api/usuarios", userRoutes);
app.use("/api/tutores", tutorRoutes);
app.use("/api/animais", animalRoutes);
app.use("/api/veterinarios", veterinarioRoutes); // Define prefixo para veterinários

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

