// backend/config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tecomat", "matheusdalia", "mononeon", {
  host: "localhost",
  dialect: "postgres", // Ou 'mysql' se estiver usando MySQL
});

module.exports = sequelize;
