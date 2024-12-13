import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "your_mailtrap_user",
      pass: "your_mailtrap_password",
    },
  });

  const mailOptions = {
    from: "no-reply@example.com",
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
