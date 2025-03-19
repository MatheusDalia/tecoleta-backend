// backend/models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("tecomat", "construtora"),
    allowNull: false,
    defaultValue: "construtora",
  },
  emailVerificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Novos campos para reset de senha
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tokenVerificacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tokenExpiracao: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

User.associate = (models) => {
  User.hasMany(models.Obra, { foreignKey: "userId" });
  User.belongsToMany(models.Obra, {
    through: "ObraColaborador",
    as: "obrasColaboradas",
    foreignKey: "userId",
  });
};

module.exports = User;
