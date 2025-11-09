// Script para criar a tabela de serviços no banco de dados
const sequelize = require("./config/database");
const { Servico } = require("./models");

async function criarTabelaServicos() {
  try {
    console.log("🔄 Iniciando criação da tabela de serviços...");

    // Conectar ao banco
    await sequelize.authenticate();
    console.log("✅ Conectado ao banco de dados");

    // Sincronizar apenas o modelo Servico
    await Servico.sync({ force: false });
    console.log('✅ Tabela "servicos" criada/sincronizada com sucesso');

    // Verificar se a tabela foi criada
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'servicos' 
      ORDER BY ordinal_position;
    `);

    console.log('📋 Estrutura da tabela "servicos":');
    results.forEach((column) => {
      console.log(
        `  - ${column.column_name}: ${column.data_type} ${
          column.is_nullable === "NO" ? "(NOT NULL)" : "(NULLABLE)"
        }`
      );
    });

    console.log("✅ Migração concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro na migração:", error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Executar a migração
criarTabelaServicos();
