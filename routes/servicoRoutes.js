const express = require("express");
const router = express.Router();
const servicoController = require("../controllers/servicoController");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Rotas para serviços
router.get("/", servicoController.listarServicos); // GET /api/servicos
router.get("/:id", servicoController.obterServico); // GET /api/servicos/:id
router.post("/", servicoController.criarServico); // POST /api/servicos
router.put("/:id", servicoController.atualizarServico); // PUT /api/servicos/:id
router.delete("/:id", servicoController.desativarServico); // DELETE /api/servicos/:id
router.patch("/:id/reativar", servicoController.reativarServico); // PATCH /api/servicos/:id/reativar

module.exports = router;
