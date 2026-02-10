// backend/models/ObraColaborador.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ObraColaborador = sequelize.define("ObraColaborador", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  obraId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ObraColaborador;
