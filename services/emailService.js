// services/emailService.js
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
require("dotenv").config();

const sesClient = new SESv2Client({
  region: process.env.AWS_REGION || "us-east-1",
});

async function sendEmail(to, subject, htmlBody) {
  const fromAddress = process.env.SES_FROM_ADDRESS;

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
}

module.exports = { sendEmail };
