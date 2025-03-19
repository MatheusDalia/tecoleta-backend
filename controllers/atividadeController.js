// backend/controllers/atividadeController.js
const Atividade = require("../models/Atividade");
const Obra = require("../models/Obra");

// Editar atividade (função estava faltando)
exports.editarAtividade = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const atividade = await Atividade.findOne({
      where: { id, userId: req.user.id },
    });

    if (!atividade) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }

    await atividade.update({ nome, descricao });
    res.status(200).json(atividade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Excluir atividade (função estava faltando)
exports.excluirAtividade = async (req, res) => {
  try {
    const { id } = req.params;

    const atividade = await Atividade.findOne({
      where: { id, userId: req.user.id },
    });

    if (!atividade) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }

    await atividade.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cadastrar nova atividade
exports.cadastrarAtividade = async (req, res) => {
  try {
    const {
      obra,
      nome,
      data,
      numeroOperarios,
      numeroAjudantes,
      horasTrabalho,
      quantidadeExecutada,
      local,
      observacoes,
      obraId,
    } = req.body;

    // Remover a dependência do userId por enquanto
    const atividade = await Atividade.create({
      obra,
      nome,
      data,
      numeroOperarios,
      numeroAjudantes,
      horasTrabalho,
      quantidadeExecutada,
      local,
      observacoes,
      obraId,
      // userId removido temporariamente
    });

    console.log("Atividade cadastrada:", atividade);

    res.status(201).json(atividade);
  } catch (error) {
    console.error("Erro ao cadastrar atividade:", error);
    res.status(400).json({ message: error.message });
  }
};

// Listar todas as atividades de uma obra específica
exports.listarAtividades = async (req, res) => {
  try {
    const { obraId } = req.query;

    // Converter obraId para número
    const obraIdNumber = obraId ? parseInt(obraId) : null;

    // Log para debug
    console.log("Buscando atividades para obra:", obraIdNumber);

    const where = {};
    if (obraIdNumber) {
      where.obraId = obraIdNumber;
    }

    // Log para debug
    console.log("Condição where:", where);

    const atividades = await Atividade.findAll({
      where,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "nome",
        "data",
        "numeroOperarios",
        "numeroAjudantes",
        "horasTrabalho",
        "quantidadeExecutada",
        "local",
        "observacoes",
        "obraId",
        "createdAt",
      ],
    });

    // Log para debug
    console.log("Atividades encontradas:", atividades.length);

    res.status(200).json(atividades);
  } catch (error) {
    console.error("Erro ao listar atividades:", error);
    res.status(400).json({
      message: error.message,
      stack: error.stack, // Remover em produção
    });
  }
};

// Criar atividade
exports.criarAtividade = async (req, res) => {
  try {
    const { nome, descricao, obraId } = req.body;
    const atividade = await Atividade.create({
      nome,
      descricao,
      obraId,
      userId: req.user.id,
    });
    res.status(201).json(atividade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = exports;
