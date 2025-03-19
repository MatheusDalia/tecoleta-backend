// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado" });
  }

  const isMatch = await bcrypt.compare(senha, user.senha);
  if (!isMatch) {
    return res.status(400).json({ message: "Senha incorreta" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, "secretkey", {
    expiresIn: "1h",
  });
  res.json({ token });
};
