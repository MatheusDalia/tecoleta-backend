// backend/models/Obra.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Obra = sequelize.define("Obra", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "ativo",
  },
});

Obra.associate = (models) => {
  Obra.belongsTo(models.User, { foreignKey: "userId" });
  Obra.hasMany(models.Atividade, { foreignKey: "obraId" });
  Obra.belongsToMany(models.User, {
    through: "ObraColaborador",
    as: "colaboradores",
    foreignKey: "obraId",
  });
};

module.exports = Obra;
