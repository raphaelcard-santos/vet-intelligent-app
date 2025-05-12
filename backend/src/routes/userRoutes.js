const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rota para registrar um novo usuário
router.post("/register", userController.registerUser);

// Rota para login de usuário
router.post("/login", userController.loginUser);

// Rota para buscar todos os usuários (exemplo, pode necessitar de proteção/autorização)
router.get("/", userController.getAllUsers);

module.exports = router;

