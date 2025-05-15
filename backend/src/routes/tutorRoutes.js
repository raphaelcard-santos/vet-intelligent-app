const express = require("express");
const router = express.Router();
const tutorController = require("../controllers/tutorController");
// const { protect, authorize } = require("../middleware/authMiddleware"); // Futuramente para proteger rotas

// Rotas para Tutores
router.post("/", tutorController.createTutor); // Criar novo tutor
router.get("/", tutorController.getAllTutores); // Listar todos os tutores
router.get("/:id", tutorController.getTutorById); // Obter tutor específico
router.put("/:id", tutorController.updateTutor); // Atualizar tutor
router.delete("/:id", tutorController.deleteTutor); // Deletar tutor

// Exemplo de como proteger rotas no futuro:
// router.post("/", protect, authorize(["admin", "veterinario"]), tutorController.createTutor);

module.exports = router;

