const { Servico, User } = require("../models");

// Função para validar dados do serviço
const validarDadosServico = (dados) => {
  const erros = [];

  if (!dados.nome || dados.nome.trim().length === 0) {
    erros.push("Nome do serviço é obrigatório");
  }

  if (dados.nome && dados.nome.trim().length < 2) {
    erros.push("Nome do serviço deve ter pelo menos 2 caracteres");
  }

  if (dados.nome && dados.nome.trim().length > 100) {
    erros.push("Nome do serviço deve ter no máximo 100 caracteres");
  }

  return erros;
};

// Listar todos os serviços
exports.listarServicos = async (req, res) => {
  try {
    console.log("📋 Listando serviços...");

    const servicos = await Servico.findAll({
      include: [
        {
          model: User,
          as: "criador",
          attributes: ["id", "email"],
        },
      ],
      order: [["nome", "ASC"]],
      where: {
        ativo: true,
      },
    });

    console.log(`✅ ${servicos.length} serviços encontrados`);

    res.json({
      success: true,
      data: servicos,
      message: `${servicos.length} serviços encontrados`,
    });
  } catch (error) {
    console.error("❌ Erro ao listar serviços:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao listar serviços",
      error: error.message,
    });
  }
};

// Obter um serviço por ID
exports.obterServico = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 Buscando serviço ID: ${id}...`);

    const servico = await Servico.findByPk(id, {
      include: [
        {
          model: User,
          as: "criador",
          attributes: ["id", "email"],
        },
      ],
    });

    if (!servico) {
      console.log("❌ Serviço não encontrado");
      return res.status(404).json({
        success: false,
        message: "Serviço não encontrado",
      });
    }

    console.log(`✅ Serviço encontrado: ${servico.nome}`);

    res.json({
      success: true,
      data: servico,
      message: "Serviço encontrado",
    });
  } catch (error) {
    console.error("❌ Erro ao obter serviço:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao obter serviço",
      error: error.message,
    });
  }
};

// Criar novo serviço
exports.criarServico = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const userId = req.user.id;

    console.log(`🆕 Criando serviço: ${nome}...`);
    console.log("Dados recebidos:", { nome, descricao, criadoPor: userId });

    // Validar dados
    const erros = validarDadosServico({ nome, descricao });
    if (erros.length > 0) {
      console.log("❌ Erros de validação:", erros);
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: erros,
      });
    }

    // Verificar se já existe serviço com esse nome
    const servicoExistente = await Servico.findOne({
      where: {
        nome: nome.trim(),
        ativo: true,
      },
    });

    if (servicoExistente) {
      console.log("❌ Serviço já existe:", nome);
      return res.status(400).json({
        success: false,
        message: "Já existe um serviço com este nome",
      });
    }

    // Criar o serviço
    const novoServico = await Servico.create({
      nome: nome.trim(),
      descricao: descricao?.trim() || null,
      criadoPor: userId,
      ativo: true,
    });

    // Buscar o serviço criado com os dados do criador
    const servicoCriado = await Servico.findByPk(novoServico.id, {
      include: [
        {
          model: User,
          as: "criador",
          attributes: ["id", "email"],
        },
      ],
    });

    console.log(`✅ Serviço criado com sucesso: ${servicoCriado.nome}`);

    res.status(201).json({
      success: true,
      data: servicoCriado,
      message: "Serviço criado com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao criar serviço:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao criar serviço",
      error: error.message,
    });
  }
};

// Atualizar serviço
exports.atualizarServico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, ativo } = req.body;

    console.log(`📝 Atualizando serviço ID: ${id}...`);
    console.log("Dados recebidos:", { nome, descricao, ativo });

    // Buscar o serviço
    const servico = await Servico.findByPk(id);

    if (!servico) {
      console.log("❌ Serviço não encontrado");
      return res.status(404).json({
        success: false,
        message: "Serviço não encontrado",
      });
    }

    // Validar dados se nome foi fornecido
    if (nome !== undefined) {
      const erros = validarDadosServico({ nome, descricao });
      if (erros.length > 0) {
        console.log("❌ Erros de validação:", erros);
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: erros,
        });
      }

      // Verificar se já existe outro serviço com esse nome
      if (nome.trim() !== servico.nome) {
        const servicoExistente = await Servico.findOne({
          where: {
            nome: nome.trim(),
            ativo: true,
            id: { [require("sequelize").Op.ne]: id },
          },
        });

        if (servicoExistente) {
          console.log("❌ Nome já existe:", nome);
          return res.status(400).json({
            success: false,
            message: "Já existe um serviço com este nome",
          });
        }
      }
    }

    // Atualizar campos
    const dadosAtualizacao = {};
    if (nome !== undefined) dadosAtualizacao.nome = nome.trim();
    if (descricao !== undefined)
      dadosAtualizacao.descricao = descricao?.trim() || null;
    if (ativo !== undefined) dadosAtualizacao.ativo = ativo;

    await servico.update(dadosAtualizacao);

    // Buscar o serviço atualizado com os dados do criador
    const servicoAtualizado = await Servico.findByPk(id, {
      include: [
        {
          model: User,
          as: "criador",
          attributes: ["id", "email"],
        },
      ],
    });

    console.log(`✅ Serviço atualizado com sucesso: ${servicoAtualizado.nome}`);

    res.json({
      success: true,
      data: servicoAtualizado,
      message: "Serviço atualizado com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar serviço:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao atualizar serviço",
      error: error.message,
    });
  }
};

// Desativar serviço (soft delete)
exports.desativarServico = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Desativando serviço ID: ${id}...`);

    // Buscar o serviço
    const servico = await Servico.findByPk(id);

    if (!servico) {
      console.log("❌ Serviço não encontrado");
      return res.status(404).json({
        success: false,
        message: "Serviço não encontrado",
      });
    }

    // Desativar o serviço
    await servico.update({ ativo: false });

    console.log(`✅ Serviço desativado com sucesso: ${servico.nome}`);

    res.json({
      success: true,
      message: "Serviço desativado com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao desativar serviço:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao desativar serviço",
      error: error.message,
    });
  }
};

// Reativar serviço
exports.reativarServico = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔄 Reativando serviço ID: ${id}...`);

    // Buscar o serviço
    const servico = await Servico.findByPk(id);

    if (!servico) {
      console.log("❌ Serviço não encontrado");
      return res.status(404).json({
        success: false,
        message: "Serviço não encontrado",
      });
    }

    // Verificar se já existe serviço ativo com mesmo nome
    const servicoExistente = await Servico.findOne({
      where: {
        nome: servico.nome,
        ativo: true,
        id: { [require("sequelize").Op.ne]: id },
      },
    });

    if (servicoExistente) {
      console.log("❌ Nome já existe ativo:", servico.nome);
      return res.status(400).json({
        success: false,
        message: "Já existe um serviço ativo com este nome",
      });
    }

    // Reativar o serviço
    await servico.update({ ativo: true });

    // Buscar o serviço reativado com os dados do criador
    const servicoReativado = await Servico.findByPk(id, {
      include: [
        {
          model: User,
          as: "criador",
          attributes: ["id", "email"],
        },
      ],
    });

    console.log(`✅ Serviço reativado com sucesso: ${servicoReativado.nome}`);

    res.json({
      success: true,
      data: servicoReativado,
      message: "Serviço reativado com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao reativar serviço:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao reativar serviço",
      error: error.message,
    });
  }
};
