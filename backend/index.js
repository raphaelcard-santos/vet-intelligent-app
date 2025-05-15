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
const tutorRoutes = require("./src/routes/tutorRoutes"); // Adiciona rotas de tutores
// Adicionar outras rotas aqui (animais, clinicas, etc.)

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend do Vet Intelligent App está funcionando!");
});

// Define o prefixo para as rotas da API
app.use("/api/usuarios", userRoutes);
app.use("/api/tutores", tutorRoutes); // Define prefixo para tutores
// app.use("/api/animais", animalRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

