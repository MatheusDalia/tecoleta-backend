// backend/config/database.js
const { Sequelize } = require("sequelize");

// Usar DATABASE_URL se disponível (produção), senão usar config local
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl:
          process.env.DB_SSL === "true"
            ? {
                require: true,
                rejectUnauthorized: false,
              }
            : false,
      },
      logging: false,
    })
  : new Sequelize("tecoleta", "tecomat", "sEfkAsd387", {
      host: "localhost",
      dialect: "postgres",
    });

module.exports = sequelize;
