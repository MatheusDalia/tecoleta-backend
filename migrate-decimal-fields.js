const { Pool } = require("pg");

const pool = new Pool({
  user: "tecomat",
  host: "localhost",
  database: "tecoleta",
  password: "sEfkAsd387",
  port: 5432,
});

async function migrateDecimalFields() {
  const client = await pool.connect();

  try {
    console.log("🔄 Iniciando migração das colunas para DECIMAL...");

    // Primeiro, verificar os tipos atuais das colunas
    const checkColumns = `
      SELECT column_name, data_type, numeric_precision, numeric_scale
      FROM information_schema.columns 
      WHERE table_name = 'Atividades' 
      AND column_name IN ('quantidadeExecutada', 'horasTrabalho')
      ORDER BY column_name;
    `;

    const result = await client.query(checkColumns);
    console.log("📊 Estado atual das colunas:", result.rows);

    // Alterar as colunas para DECIMAL
    const alterQueries = [
      'ALTER TABLE "Atividades" ALTER COLUMN "quantidadeExecutada" TYPE DECIMAL(15,3);',
      'ALTER TABLE "Atividades" ALTER COLUMN "horasTrabalho" TYPE DECIMAL(15,3);',
    ];

    for (const query of alterQueries) {
      console.log(`🔄 Executando: ${query}`);
      await client.query(query);
      console.log("✅ Query executada com sucesso");
    }

    // Verificar novamente após a migração
    const resultAfter = await client.query(checkColumns);
    console.log("📊 Estado das colunas após migração:", resultAfter.rows);

    console.log("✅ Migração concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateDecimalFields()
  .then(() => {
    console.log("🎉 Processo de migração finalizado!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Falha na migração:", error);
    process.exit(1);
  });
