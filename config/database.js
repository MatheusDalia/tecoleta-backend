// backend/config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tecoleta", "tecoleta", "sEfkAsd387", {
  host: "localhost",
  dialect: "postgres", // Ou 'mysql' se estiver usando MySQL
});

module.exports = sequelize;
