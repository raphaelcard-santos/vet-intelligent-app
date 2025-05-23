const express = require("express");
const router = express.Router();
const { obterDiagnosticoIA } = require("../controllers/diagnosticoController");
const { protect } = require("../middleware/auth");

// Rota para obter diagnóstico da IA
// POST /api/diagnostico
router.post("/", protect, obterDiagnosticoIA);

module.exports = router;
