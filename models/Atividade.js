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
    type: DataTypes.DECIMAL(15, 3), // Permite até 15 dígitos antes da vírgula e 3 após
    allowNull: false,
  },
  quantidadeExecutada: {
    type: DataTypes.DECIMAL(15, 3), // Permite até 15 dígitos antes da vírgula e 3 após
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
