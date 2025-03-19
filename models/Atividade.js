// backend/models/Atividade.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Atividade = sequelize.define("Atividade", {
  obra: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  numeroOperarios: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numeroAjudantes: {
    type: DataTypes.INTEGER,
    allowNull: true, // Opcional
  },
  horasTrabalho: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantidadeExecutada: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  local: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true, // Opcional
  },
});

Atividade.associate = (models) => {
  Atividade.belongsTo(models.Obra, { foreignKey: "obraId" });
};

module.exports = Atividade;
