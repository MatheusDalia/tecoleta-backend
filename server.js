// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/database"); // Configuração do banco de dados

// Importar os modelos através do index
const { User, Obra, Atividade, ObraColaborador } = require("./models");

// Importar as rotas
const obraRoutes = require("./routes/obraRoutes");
const atividadeRoutes = require("./routes/atividadeRoutes");
const authRoutes = require("./routes/authRoutes"); // Adicionar a importação das rotas de autenticação
const usuarioRoutes = require("./routes/usuarioRoutes"); // Note o nome correto do arquivo

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Adicione antes das rotas
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas
app.use("/api/obras", obraRoutes); // Rotas para Obras
app.use("/api/atividades", atividadeRoutes); // Rotas para Atividades
app.use("/api", authRoutes); // Registrar as rotas de autenticação (como /api/cadastro, /api/login)
app.use("/api/usuarios", usuarioRoutes);

// Autenticar a conexão com o banco de dados antes de sincronizar
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");

    // Sincronizar o banco de dados e iniciar o servidor
    return sequelize.sync({ force: true }); // Adicionando { force: true } para recriar as tabelas
  })
  .then(() => {
    app.listen(3003, () => {
      console.log("Servidor rodando na porta 3003");
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });
