import nodemailer from "nodemailer";
import dotenv from "dotenv";
// config/mail.ts
dotenv.config();

const mailConfig = {
  host: process.env.MAIL_HOST as string,
  port: parseInt(process.env.MAIL_PORT || "2525", 10),
  auth: {
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string,
  },
  from: process.env.MAIL_USER as string, // Default sender address
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    auth: mailConfig.auth,
  });

  const mailOptions = {
    from: mailConfig.from,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email: ${error}`);
    throw error;
  }
};
