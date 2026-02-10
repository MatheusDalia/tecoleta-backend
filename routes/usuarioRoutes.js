const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", usuarioController.listarUsuarios);
router.get("/por-email", usuarioController.buscarUsuarioPorEmail);

module.exports = router;
