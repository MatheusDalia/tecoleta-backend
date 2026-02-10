// backend/controllers/atividadeController.js
const Atividade = require("../models/Atividade");
const Obra = require("../models/Obra");

// Função para converter vírgulas em pontos nos campos numéricos
const processarCamposNumericos = (data) => {
  const camposNumericos = [
    "numeroOperarios",
    "numeroAjudantes",
    "horasTrabalho",
    "quantidadeExecutada",
  ];

  console.log("ANTES do processamento:", data);

  camposNumericos.forEach((campo) => {
    if (data[campo] !== undefined && data[campo] !== null) {
      const valorOriginal = data[campo];
      // Converte string com vírgula para número com ponto decimal
      if (typeof data[campo] === "string") {
        data[campo] = data[campo].replace(",", ".");
        console.log(`Campo ${campo}: "${valorOriginal}" -> "${data[campo]}"`);
      }
      // Converte para número (parseFloat aceita tanto ponto quanto string numérica)
      data[campo] = parseFloat(data[campo]);
      console.log(
        `Campo ${campo} final: ${data[campo]} (tipo: ${typeof data[campo]})`
      );
    }
  });

  console.log("DEPOIS do processamento:", data);
  return data;
};

// Editar atividade (função estava faltando)
exports.editarAtividade = async (req, res) => {
  try {
    const { id } = req.params;
    let dadosAtualizacao = req.body;

    const atividade = await Atividade.findByPk(id);

    if (!atividade) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }

    // Processar campos numéricos se existirem nos dados de atualização
    dadosAtualizacao = processarCamposNumericos(dadosAtualizacao);

    await atividade.update(dadosAtualizacao);
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
    let {
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

    // Processar campos numéricos (converter vírgulas em pontos)
    const dadosProcessados = processarCamposNumericos({
      numeroOperarios,
      numeroAjudantes,
      horasTrabalho,
      quantidadeExecutada,
    });

    // Remover a dependência do userId por enquanto
    const atividade = await Atividade.create({
      obra,
      nome,
      data,
      numeroOperarios: dadosProcessados.numeroOperarios,
      numeroAjudantes: dadosProcessados.numeroAjudantes,
      horasTrabalho: dadosProcessados.horasTrabalho,
      quantidadeExecutada: dadosProcessados.quantidadeExecutada,
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
