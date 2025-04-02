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

exports.buscarUsuarioPorEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email não fornecido" });
    }

    const usuario = await User.findOne({
      where: { email: email },
      attributes: ["id", "email"],
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error);
    res.status(400).json({ message: error.message });
  }
};
