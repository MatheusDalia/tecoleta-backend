const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Servico = sequelize.define(
  "Servico",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    criadoPor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    criadoEm: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    atualizadoEm: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "servicos",
    timestamps: true,
    createdAt: "criadoEm",
    updatedAt: "atualizadoEm",
  }
);

// Definir associações
Servico.associate = (models) => {
  // Um serviço pertence a um usuário (quem criou)
  Servico.belongsTo(models.User, {
    foreignKey: "criadoPor",
    as: "criador",
  });
};

module.exports = Servico;
