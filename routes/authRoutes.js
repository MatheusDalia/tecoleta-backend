const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User");
require("dotenv").config();
const { Op } = require("sequelize");

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true para 465, false para 587/25
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verificar se email já existe
router.post("/verificar-email", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    return res.json({ exists: !!user });
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    res.status(500).json({ message: "Erro ao verificar email" });
  }
});

// Cadastro de usuário
router.post("/cadastro", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verificar se o email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    // Gerar token de verificação
    const tokenVerificacao = crypto.randomBytes(32).toString("hex");
    const tokenExpiracao = new Date();
    tokenExpiracao.setHours(tokenExpiracao.getHours() + 24); // Token válido por 24 horas

    // Criar usuário
    const hashedSenha = await bcrypt.hash(senha, 10);
    const user = await User.create({
      email,
      senha: hashedSenha,
      tokenVerificacao,
      tokenExpiracao,
      emailVerificado: false,
    });

    // Enviar email de verificação
    const verificationLink = `${process.env.FRONTEND_URL}/api/confirmar-email?token=${tokenVerificacao}`;
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verifique seu email",
      html: `<h1>Bem-vindo ao nosso sistema!</h1>
             <p>Por favor, clique no link abaixo para confirmar seu email:</p>
             <a href="${verificationLink}">Confirmar email</a>
             <p>Este link é válido por 24 horas.</p>`,
    });

    res.status(201).json({
      success: true,
      message:
        "Usuário cadastrado com sucesso. Por favor, verifique seu email.",
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
});

// Reenviar email de verificação
router.post("/enviar-verificacao", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email não fornecido" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Conta não cadastrada. Por favor, crie uma conta." });
    }

    if (user.emailVerificado) {
      return res.status(200).json({ message: "A conta já está verificada." });
    }

    // Gerar novo token
    const tokenVerificacao = crypto.randomBytes(32).toString("hex");
    const tokenExpiracao = new Date();
    tokenExpiracao.setHours(tokenExpiracao.getHours() + 24);

    // Atualizar token no banco
    await user.update({
      tokenVerificacao,
      tokenExpiracao,
    });

    // Enviar novo email
    const verificationLink = `${process.env.FRONTEND_URL}/api/confirmar-email?token=${tokenVerificacao}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER || process.env.EMAIL_USER,
      to: email,
      subject: "Verifique seu email",
      html: `
        <h1>Verificação de email</h1>
        <p>Por favor, clique no link abaixo para verificar seu email:</p>
        <a href="${verificationLink}">Verificar email</a>
        <p>Este link é válido por 24 horas.</p>
      `,
    });

    res.json({ message: "Email de verificação reenviado com sucesso." });
  } catch (error) {
    console.error("Erro ao reenviar verificação:", error);
    res.status(500).json({ message: "Erro ao reenviar email de verificação" });
  }
});

// Confirmar verificação de email
router.get("/confirmar-email", async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      where: {
        tokenVerificacao: token,
        emailVerificado: false,
        tokenExpiracao: { [Op.gt]: new Date() }, // Token ainda não expirou
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token inválido ou expirado",
      });
    }

    // Atualizar usuário como verificado
    await user.update({
      emailVerificado: true,
      tokenVerificacao: null,
      tokenExpiracao: null,
    });

    res.json({ message: "Email verificado com sucesso" });
  } catch (error) {
    console.error("Erro ao confirmar email:", error);
    res.status(500).json({ message: "Erro ao confirmar email" });
  }
});

// Atualizar login para verificar se email está verificado
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  console.log("jabuti");
  console.log(req.body);

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    if (!user.emailVerificado) {
      return res.status(403).json({
        message: "Email não verificado. Por favor, verifique seu email.",
      });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    // Criar o token JWT com o id e o role do usuário
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Incluindo o role no payload
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" } // Token expira em 1 hora
    );

    res.json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});

// Nova rota: Solicitar redefinição de senha
router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuário não encontrado com este email." });
    }

    // Gerar token de redefinição de senha
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiration = new Date();
    resetExpiration.setHours(resetExpiration.getHours() + 1); // Token válido por 1 hora

    // Atualizar usuário com token de redefinição
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpiration,
    });

    // Criar URL de redefinição
    const baseUrl = "meuapp:";
    const resetUrl = `${baseUrl}//reset-password?token=${resetToken}`;

    // Enviar email com link de redefinição
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Redefinição de Senha",
      html: `
        <h1>Redefinição de Senha</h1>
        <p>Você solicitou a redefinição de sua senha.</p>
        <p>Use o token abaixo no aplicativo para redefinir sua senha:</p>
        <p style="font-family: monospace; font-size: 20px;">${resetToken}</p>
        <p>Este token é válido por 1 hora.</p>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `,
    });

    res.json({
      success: true,
      message: "Email enviado com instruções para redefinir sua senha.",
    });
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    res.status(500).json({
      message: "Erro ao processar solicitação de redefinição de senha.",
    });
  }
});

// Nova rota: Redefinir senha com token
router.post("/new-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verificar se existe um usuário com este token que ainda é válido
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }, // Token ainda não expirou
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar usuário com nova senha, limpar tokens e marcar como verificado
    await user.update({
      senha: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      emailVerificado: true, // Marca como verificado após redefinir senha
    });

    res.json({
      success: true,
      message: "Senha alterada com sucesso! Faça login com sua nova senha.",
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ message: "Erro ao redefinir senha." });
  }
});

module.exports = router;
