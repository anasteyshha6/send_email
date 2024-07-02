import express from "express";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Источник
  })
);
app.use(express.json());

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_RU_USER,
    pass: process.env.MAIL_RU_PASSWORD,
  },
});

app.post("/email", async (req, res) => {
  const { name, phoneNum, email } = req.body;

  try {
    await transporter.sendMail({
      html: `<p>Уважаемый Николай Николаевич,</p>
        <p>Вы получили новую заявку на бурение скважины с вашего сайта. Ниже приведены данные клиента:</p>
        <br>
        <p><strong>Имя клиента:</strong> ${name}</p>
        <p><strong>Номер телефона:</strong> ${phoneNum}</p>
        <p><strong>Email клиента:</strong> ${email}</p>
        <br>
        <p>С уважением, Ваша команда сайта "Бур-52"</p>`,
      to: process.env.MAIL_TO,
      subject: "Новая заявка на бурение скважины с сайта",
      from: process.env.MAIL_RU_USER,
    });

    res.send("success");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("error");
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));
