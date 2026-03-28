// services/emailService.js
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
const nodemailer = require("nodemailer");
require("dotenv").config();

const sesClient = new SESv2Client({
  region: process.env.AWS_REGION || "us-east-1",
});

function buildSmtpTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

/**
 * Send an email using AWS SES (primary) with SMTP nodemailer as fallback.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlBody - HTML content of the email
 */
async function sendEmail(to, subject, htmlBody) {
  const fromAddress = process.env.SES_FROM_ADDRESS || process.env.SMTP_USER;

  // --- Primary: AWS SES ---
  try {
    const command = new SendEmailCommand({
      FromEmailAddress: fromAddress,
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: { Html: { Data: htmlBody, Charset: "UTF-8" } },
        },
      },
    });
    await sesClient.send(command);
    console.log(`[emailService] Email enviado via AWS SES para: ${to}`);
    return;
  } catch (sesError) {
    console.error(
      "[emailService] Falha no AWS SES, tentando fallback SMTP:",
      sesError.message,
    );
  }

  // --- Fallback: SMTP nodemailer ---
  try {
    const transporter = buildSmtpTransporter();
    await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html: htmlBody,
    });
    console.log(`[emailService] Email enviado via SMTP (fallback) para: ${to}`);
  } catch (smtpError) {
    console.error(
      "[emailService] Falha no SMTP (fallback):",
      smtpError.message,
    );
    throw smtpError;
  }
}

module.exports = { sendEmail };
