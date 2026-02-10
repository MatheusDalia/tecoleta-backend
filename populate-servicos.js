// Script para popular a tabela de serviços com dados iniciais
const sequelize = require("./config/database");
const { Servico, User } = require("./models");

async function popularServicosIniciais() {
  try {
    console.log("🌱 Iniciando população de serviços iniciais...");

    // Conectar ao banco
    await sequelize.authenticate();
    console.log("✅ Conectado ao banco de dados");

    // Buscar um usuário admin para ser o criador dos serviços iniciais
    const adminUser = await User.findOne({
      where: { role: "tecomat" },
    });

    if (!adminUser) {
      console.log(
        "❌ Nenhum usuário admin (tecomat) encontrado. Execute este script após criar um usuário admin."
      );
      return;
    }

    console.log(`👤 Usando usuário admin: ${adminUser.email}`);

    // Serviços iniciais baseados no que você mencionou no frontend
    const servicosIniciais = [
      {
        nome: "Acabamentos",
        descricao: "Serviços de acabamento e finalização",
        criadoPor: adminUser.id,
      },
      {
        nome: "Estrutura",
        descricao: "Serviços estruturais da obra",
        criadoPor: adminUser.id,
      },
      {
        nome: "Alvenaria",
        descricao: "Construção de paredes e muros",
        criadoPor: adminUser.id,
      },
      {
        nome: "Instalações",
        descricao: "Instalações elétricas, hidráulicas e de gás",
        criadoPor: adminUser.id,
      },
      {
        nome: "Cobertura",
        descricao: "Serviços de telhado e cobertura",
        criadoPor: adminUser.id,
      },
      {
        nome: "Pisos",
        descricao: "Instalação e acabamento de pisos",
        criadoPor: adminUser.id,
      },
    ];

    // Verificar quais serviços já existem
    for (const servicoData of servicosIniciais) {
      const servicoExistente = await Servico.findOne({
        where: { nome: servicoData.nome },
      });

      if (servicoExistente) {
        console.log(`⚠️  Serviço "${servicoData.nome}" já existe, pulando...`);
        continue;
      }

      // Criar o serviço
      await Servico.create(servicoData);
      console.log(`✅ Serviço "${servicoData.nome}" criado com sucesso`);
    }

    // Listar todos os serviços ativos
    const servicosAtivos = await Servico.findAll({
      where: { ativo: true },
      include: [
        {
          model: User,
          as: "criador",
          attributes: ["email"],
        },
      ],
    });

    console.log("\n📋 Serviços ativos no sistema:");
    servicosAtivos.forEach((servico) => {
      console.log(`  - ${servico.nome} (criado por: ${servico.criador.email})`);
    });

    console.log("\n✅ População inicial concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro na população inicial:", error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Executar a população
popularServicosIniciais();
