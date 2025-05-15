const express = require("express");
const router = express.Router();
const veterinarioController = require("../controllers/veterinarioController");
// const { protect, authorize } = require("../middleware/authMiddleware"); // Futuramente para proteger rotas

// Rotas para Veterinarios
router.post("/", veterinarioController.createVeterinario);
router.get("/", veterinarioController.getAllVeterinarios);
router.get("/:id", veterinarioController.getVeterinarioById);
router.put("/:id", veterinarioController.updateVeterinario);
router.delete("/:id", veterinarioController.deleteVeterinario);

module.exports = router;

