const Obra = require("../models/Obra");
const { Op } = require("sequelize");
const User = require("../models/User");

// Listar todas as obras
exports.listarObras = async (req, res) => {
  try {
    let obras = await Obra.findAll();
    res.status(200).json(obras);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cadastrar uma obra
exports.cadastrarObra = async (req, res) => {
  try {
    const { nome, colaboradores, userId } = req.body;
    console.log("Dados recebidos:", { nome, colaboradores, userId });

    // Criar a obra
    const obra = await Obra.create({
      nome,
      userId: userId || 1, // Usar userId do body ou default para 1
      status: "ativo",
    });

    // Se houver colaboradores, adicionar eles
    if (colaboradores && colaboradores.length > 0) {
      await obra.addColaboradores(colaboradores);
    }

    res.status(201).json(obra);
  } catch (error) {
    console.error("Erro ao cadastrar obra:", error);
    res.status(400).json({
      message: error.message,
      details: error.errors?.map((e) => e.message),
    });
  }
};

// Editar uma obra
exports.editarObra = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
    const obra = await Obra.findByPk(id);

    if (!obra) {
      return res.status(404).json({ message: "Obra não encontrada" });
    }

    await Obra.update({ nome }, { where: { id } });

    const obraAtualizada = await Obra.findByPk(id);
    res.status(200).json(obraAtualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Excluir uma obra
exports.excluirObra = async (req, res) => {
  const { id } = req.params;

  try {
    const obra = await Obra.findByPk(id);

    if (!obra) {
      return res.status(404).json({ message: "Obra não encontrada" });
    }

    await Obra.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Adicionar colaborador a uma obra
exports.adicionarColaborador = async (req, res) => {
  const { obraId, userId } = req.body;

  try {
    const obra = await Obra.findByPk(obraId);
    if (!obra) {
      return res.status(404).json({ message: "Obra não encontrada" });
    }

    await obra.addColaborador(userId);
    res.status(200).json({ message: "Colaborador adicionado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.listarColaboradores = async (req, res) => {
  const { id } = req.params;

  try {
    const obra = await Obra.findByPk(id, {
      include: [{ model: User, as: "colaboradores" }],
    });

    if (!obra) {
      return res.status(404).json({ message: "Obra não encontrada" });
    }

    res.status(200).json(obra.colaboradores);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Listar obras por usuário (como dono ou colaborador)
exports.listarObrasPorUsuario = async (req, res) => {
  const { userId } = req.params;
  const userRole = req.user?.role; // Supondo que o role do usuário esteja disponível no req.user

  console.log("Buscando obras para o usuário:", userId, "Role:", userRole);

  try {
    // Se o usuário for 'tecomat', retorna todas as obras
    if (userRole === "tecomat") {
      const todasObras = await Obra.findAll({
        include: [
          {
            model: User,
            as: "colaboradores",
            attributes: ["id", "email"],
            through: { attributes: [] },
          },
        ],
      });
      console.log("Todas as obras (tecomat):", todasObras.length);
      return res.status(200).json(todasObras);
    }

    // Caso contrário, busca as obras do usuário específico (como dono ou colaborador)
    const obrasComoDono = await Obra.findAll({
      where: { userId: userId },
    });
    console.log("Obras como dono:", obrasComoDono.length);

    const obrasComoColaborador = await Obra.findAll({
      include: [
        {
          model: User,
          as: "colaboradores",
          through: "ObraColaborador",
          where: { id: userId },
          required: true,
        },
      ],
    });
    console.log("Obras como colaborador:", obrasComoColaborador.length);

    // Combinar os resultados e remover duplicatas
    const todasObras = [...obrasComoDono, ...obrasComoColaborador];
    const obrasUnicas = Array.from(
      new Map(todasObras.map((obra) => [obra.id, obra])).values()
    );
    console.log("Total de obras únicas:", obrasUnicas.length);

    res.status(200).json(obrasUnicas);
  } catch (error) {
    console.error("Erro detalhado ao listar obras do usuário:", error);
    res.status(400).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

exports.buscarObraPorId = async (req, res) => {
  try {
    const obra = await Obra.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: "colaboradores",
          attributes: ["id", "email"],
          through: { attributes: [] },
        },
      ],
    });

    if (!obra) {
      return res.status(404).json({ message: "Obra não encontrada" });
    }

    res.status(200).json(obra);
  } catch (error) {
    console.error("Erro ao buscar obra:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.createOrUpdateObra = async (req, res) => {
  try {
    const { id, nome, colaboradores, userId } = req.body;
    console.log("Dados recebidos:", { id, nome, colaboradores, userId });

    let obra;
    if (id) {
      // Atualizar obra existente
      obra = await Obra.findByPk(id);
      if (!obra) {
        return res.status(404).json({ message: "Obra não encontrada" });
      }

      await obra.update({ nome });

      // Atualizar colaboradores
      if (colaboradores) {
        await obra.setColaboradores(colaboradores);
      }
    } else {
      // Criar nova obra
      obra = await Obra.create({
        nome,
        userId,
        status: "ativo",
      });

      // Adicionar colaboradores
      if (colaboradores && colaboradores.length > 0) {
        await obra.setColaboradores(colaboradores);
      }
    }

    // Buscar a obra atualizada com os colaboradores
    const obraAtualizada = await Obra.findOne({
      where: { id: obra.id },
      include: [
        {
          model: User,
          as: "colaboradores",
          attributes: ["id", "email"],
          through: { attributes: [] },
        },
      ],
    });

    console.log("Obra salva com sucesso:", obraAtualizada);
    res.status(200).json(obraAtualizada);
  } catch (error) {
    console.error("Erro ao criar/atualizar obra:", error);
    res.status(400).json({
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
