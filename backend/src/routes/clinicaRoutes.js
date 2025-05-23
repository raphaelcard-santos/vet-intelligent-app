const express = require("express");
const router = express.Router();
const clinicaController = require("../controllers/clinicaController");
// const { protect, authorize } = require("../middleware/auth.js"); // Futuramente para proteger rotas

// Rotas para Clínicas
router.post("/", clinicaController.createClinica);
router.get("/", clinicaController.getAllClinicas);
router.get("/:id", clinicaController.getClinicaById);
router.put("/:id", clinicaController.updateClinica);
router.delete("/:id", clinicaController.deleteClinica);

// Rotas para associar/desassociar veterinários de clínicas
router.post("/:clinicaId/veterinarios/:veterinarioId", clinicaController.addVeterinarioToClinica);
router.delete("/:clinicaId/veterinarios/:veterinarioId", clinicaController.removeVeterinarioFromClinica);
router.get("/:clinicaId/veterinarios", clinicaController.getVeterinariosByClinicaId);

module.exports = router;

