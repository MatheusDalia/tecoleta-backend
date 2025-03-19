// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  try {
    // Pegar o token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    // O token vem como "Bearer <token>", então precisamos pegar só o token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    // Adicionar o id do usuário decodificado à requisição
    req.user = decoded;

    return next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = authMiddleware;
