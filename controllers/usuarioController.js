const User = require("../models/User");

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: ["id", "email"],
      order: [["email", "ASC"]],
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(400).json({ message: error.message });
  }
};
