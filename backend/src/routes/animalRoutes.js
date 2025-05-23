const express = require("express");
const router = express.Router();
const animalController = require("../controllers/animalController");
// const { protect, authorize } = require("../middleware/auth.js"); // Futuramente para proteger rotas

// Rotas para Animais
router.post("/", animalController.createAnimal); // Criar novo animal
router.get("/", animalController.getAllAnimais); // Listar todos os animais (pode filtrar por tutorId na query)
router.get("/:id", animalController.getAnimalById); // Obter animal específico
router.put("/:id", animalController.updateAnimal); // Atualizar animal
router.delete("/:id", animalController.deleteAnimal); // Deletar animal

module.exports = router;

