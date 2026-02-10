// backend/routes/obraRoutes.js
const express = require("express");
const router = express.Router();
const obraController = require("../controllers/obraController");
// const authMiddleware = require("../middleware/authMiddleware");

// Nova rota para buscar obras de um usuário específico (como dono ou colaborador)
router.get("/user/:userId", obraController.listarObrasPorUsuario);
// Rotas sem autenticação
router.post("/", obraController.createOrUpdateObra);
router.get("/", obraController.listarObras);
router.put("/:id", obraController.editarObra);
router.delete("/:id", obraController.excluirObra);
router.post("/adicionar-colaborador", obraController.adicionarColaborador);

// Nova rota para buscar colaboradores de uma obra
router.get("/:id/colaboradores", obraController.listarColaboradores);

// Rota para buscar obra específica por ID
router.get("/:id", obraController.buscarObraPorId);

module.exports = router;
