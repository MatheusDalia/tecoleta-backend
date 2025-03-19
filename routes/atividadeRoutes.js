// backend/routes/atividadeRoutes.js
const express = require("express");
const router = express.Router();
const atividadeController = require("../controllers/atividadeController");
// const authMiddleware = require("../middleware/authMiddleware");

// Rotas de atividade
router.get("/", atividadeController.listarAtividades);
router.post("/", atividadeController.cadastrarAtividade);
router.put("/:id", atividadeController.editarAtividade);
router.delete("/:id", atividadeController.excluirAtividade);

module.exports = router;
