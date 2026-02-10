// Script para criar usuários de teste para Apple Review
const bcrypt = require("bcryptjs");
const sequelize = require("./config/database");
const { User } = require("./models");

async function criarUsuariosTeste() {
  try {
    console.log("🌱 Criando usuários de teste...");

    // Conectar ao banco
    await sequelize.authenticate();
    console.log("✅ Conectado ao banco de dados");

    // Sincronizar modelos
    await sequelize.sync();

    // Senha padrão para contas de teste
    const senhaTest = "TecoTest2026!";
    const hashedSenha = await bcrypt.hash(senhaTest, 10);

    // Verificar se admin já existe
    let adminUser = await User.findOne({
      where: { email: "admin@tecomat.com" },
    });

    if (!adminUser) {
      // Criar usuário admin (Tecomat)
      adminUser = await User.create({
        email: "admin@tecomat.com",
        senha: hashedSenha,
        role: "tecomat",
        emailVerificado: true,
      });
      console.log("✅ Usuário admin criado: admin@tecomat.com");
    } else {
      console.log("ℹ️  Usuário admin já existe: admin@tecomat.com");
    }

    // Verificar se construtora já existe
    let construtoraUser = await User.findOne({
      where: { email: "construtora@teste.com" },
    });

    if (!construtoraUser) {
      // Criar usuário construtora (teste)
      construtoraUser = await User.create({
        email: "construtora@teste.com",
        senha: hashedSenha,
        role: "construtora",
        emailVerificado: true,
      });
      console.log("✅ Usuário construtora criado: construtora@teste.com");
    } else {
      console.log("ℹ️  Usuário construtora já existe: construtora@teste.com");
    }

    console.log("\n📋 CREDENCIAIS DE TESTE:");
    console.log("========================");
    console.log("\n🔧 ADMIN (Tecomat):");
    console.log("   Email: admin@tecomat.com");
    console.log("   Senha: TecoTest2026!");
    console.log("   Role: tecomat");
    console.log("\n👷 CONSTRUTORA:");
    console.log("   Email: construtora@teste.com");
    console.log("   Senha: TecoTest2026!");
    console.log("   Role: construtora");
    console.log("\n✅ Usuários de teste criados com sucesso!");
    console.log("\n📄 Veja APPLE_TEST_CREDENTIALS.md para mais detalhes\n");
  } catch (error) {
    console.error("❌ Erro ao criar usuários de teste:", error);
  } finally {
    await sequelize.close();
  }
}

criarUsuariosTeste();
