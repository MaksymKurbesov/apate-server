import express from "express";
import useragent from "express-useragent";
import xmlparser from "express-xml-bodyparser";
import nodemailer from "nodemailer";
import cors from "cors";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import DeviceDetector from "node-device-detector";
import fs from "fs";
import https from "https";
import http from "http";
import geoip from "geoip-lite";
import { privateKeyTemplate } from "./privateKeyTemplate.js";
import { congratulationEmail } from "./congratulationEmail.js";
import { promocodeEmail } from "./promocodeEmail.js";
import { sendPromocode25 } from "./promocode25.js";
import Queue from "bull";
import { TINKOFF_EMAILS } from "./TINKOFF_EMAILS.js";
import { tinkoffEmail } from "./tinkoffEmail.js";
import { deleteAcc } from "./deleteAcc.js";

const firestoreApp = initializeApp();
const db = getFirestore();

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

const supportEmail = "support@apatecyprusestate.com";
const supportEmailPassword = "trewQ!2345";

const emailQueue = new Queue("emailQueue", {
  limiter: {
    max: 150, // Максимальное количество задач
    duration: 3600000, // Продолжительность в миллисекундах (1 час = 3600000 мс)
  },
});

async function sendEmail({ from, to, bcc, subject, html }) {
  try {
    await mailTransport.sendMail({ from, to, bcc, subject, html });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

emailQueue.process(async (job, done) => {
  await sendEmail(job.data);
  done();
});

const mailTransport = nodemailer.createTransport({
  host: "mail.apatecyprusestate.com",
  name: "mail.apatecyprusestate.com",
  secure: true,
  port: 465,
  auth: {
    user: supportEmail,
    pass: supportEmailPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const app = express();

app.use(useragent.express());
app.use(cors());
app.use(express.json());
app.use(xmlparser());

app.enable("trust proxy");

const httpsOptions = {
  cert: fs.readFileSync("ssl/apate.crt"),
  key: fs.readFileSync("ssl/apate.key"),
  ca: fs.readFileSync("ssl/apate.ca-bundle"),
};

app.post("/sendPrivateKey", async (req, res) => {
  const { to, subject, privateKey, username } = req.body;

  try {
    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to,
      subject,
      html: privateKeyTemplate(privateKey, username),
    });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/sendPromocode", async (req, res) => {
  const { to, subject, username } = req.body;

  try {
    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to,
      subject,
      html: promocodeEmail(username),
    });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/");

app.post("/send25promocode", async (req, res) => {
  const { to, subject, username } = req.body;

  try {
    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to,
      subject,
      html: sendPromocode25(username),
    });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/sendCongratulationEmail", async (req, res) => {
  const { to, subject, username, nomination, position } = req.body;

  try {
    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to,
      subject,
      html: congratulationEmail(username, nomination, position),
    });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/send25promocodeToAll", async (req, res) => {
  try {
    const allUsers = await getAuth().listUsers(1000);
    const allUsersEmail = allUsers.users.map((user) => user.email).slice(150);

    allUsersEmail.forEach((email) => {
      emailQueue.add({
        from: `Apate Cyprus Estate Support <${supportEmail}>`,
        to: email,
        subject: "Акция!",
        html: sendPromocode25("партнёр"),
      });
    });

    emailQueue.on("completed", (job) => {
      console.log(`Job with id ${job.id} has been completed`);
    });

    emailQueue.on("failed", (job, err) => {
      console.error(
        `Job with id ${job.id} has failed with error ${err.message}`,
      );
    });

    // await mailTransport.sendMail({
    //   from: `Apate Cyprus Estate Support <${supportEmail}>`,
    //   to: ``,
    //   bcc: allUsersEmail.splice(0, 150),
    //   subject: "Акция!",
    //   html: sendPromocode25("партнёр"),
    // });
    res.status(200).send(`Email sent successfully, ${allUsersEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/sendTinkoff", async (req, res) => {
  try {
    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to: ``,
      bcc: TINKOFF_EMAILS,
      subject: "Присоединяйтесь к инвестициям вместе с нами!",
      html: tinkoffEmail(),
    });
    res.status(200).send(`Email sent successfully`);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/sendDeleteAcc", async (req, res) => {
  const { to } = req.body;

  try {
    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to: to,
      subject: "Ваш аккаунт был заблокирован!",
      html: deleteAcc(),
    });
    res.status(200).send(`Email sent successfully`);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/sendTinkoffEmail", async (req, res) => {
  const { to } = req.body;

  try {
    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to: to,
      subject: "Присоединяйтесь к инвестициям вместе с нами!",
      html: tinkoffEmail(),
    });
    res.status(200).send(`Email sent successfully`);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/sendEmailToAll", async (req, res) => {
  try {
    const allUsers = await getAuth().listUsers(1000);
    const allUsersEmail = allUsers.users.map((user) => user.email);

    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to: ``,
      bcc: allUsersEmail,
      subject: "Акция!",
      html: `<body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
    <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA">
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
        <tr>
            <td valign="top" style="padding:0;Margin:0">
                <table class="es-header" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                    <tr>
                        <td align="center" style="padding:0;Margin:0">
                            <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                                <tr>
                                    <td align="left">
                                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr><td style="padding:0;Margin:0;padding-bottom:20px;font-size:0px" align="center"><img src="https://i.imgur.com/JuRVpxa.png" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;font-size:12px" title="Logo" width="100%"></td></tr>
                                                        <tr>
                                                            <td style="padding:0;Margin:0;padding-bottom:20px;font-size:0px" align="center"><img src="https://i.imgur.com/kKfOFNL.png" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;font-size:12px" title="Logo" width="200" height="48"></td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:0;Margin:0">
                                                                <table class="es-menu" width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr class="links">
                                                                        <td style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0" width="50%" valign="top" align="center"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#666666;font-size:14px">+357 22 761795</a></td>
                                                                        <td style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0" width="50%" valign="top" align="center"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#666666;font-size:14px">support@apatecyprusestate.com</a></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <table class="es-content" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                    <tr>
                        <td align="center" style="padding:0;Margin:0">
                            <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;border-top:10px solid #7957FF;width:600px;border-bottom:10px solid #7957FF" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none">
                                <tr>
                                    <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:30px">
                                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0">
                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">${new Date().toLocaleDateString(
                                                                  "ru-RU",
                                                                )}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;background-image:url(https://i.imgur.com/4OM6MoB.png);background-repeat:no-repeat;background-position:center" background="https://i.imgur.com/4OM6MoB.png" align="left">
                                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td class="es-m-txt-l" align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:10px">
                                                                <h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#7957FF">Здравствуйте,</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:10px">
                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Мы рады сообщить вам о запуске уникальной акции от <b>Apate Cyprus Estate!</b> В рамках нашего стремления к инновациям и предоставлению выгодных возможностей для наших клиентов, мы предлагаем вам эксклюзивное предложение.<br><br></p>
                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:30px;color:#0d2035;font-size:24px;text-align: center"><b><i>Пополните личный кабинет и получите +10% бонуса на ваш счет!</i></b><br><br></p>
                                                                <p style="text-align: center"><b>Промокод:</b> </p>
                                                                <div style="font-size: 24px;font-weight: 600;text-align: center;background: #f0f0f0;width: 50%;padding: 20px;margin:0 auto;border-radius: 10px;color: #7957FF;">
                                                                    ApateMerryXmas2024
                                                                </div><br><br>
                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Это идеальная возможность для тех, кто ищет выгодные инвестиции в недвижимость и хочет расширить свой инвестиционный портфель. <br><br></p>
<!--                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Не забудьте ознакомиться с нашими аналитическими отчетами и рыночными обзорами, которые помогут вам принимать обоснованные решения.</p><br>-->
                                                                <h3>Как это работает?</h3>
                                                                <ul style="list-style: none">
                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px">1. На сайте компании в разделе <b>"Пополнить счёт"</b> выберите любой удобный для вас способ оплаты.</li>
                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px">2. При пополнение счёта, на сайте, в поле <b>"Номер транзакции"</b> добавьте через точку с запятой (;) выше указанный промокод.</li>
                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px">3. Мы автоматически начислем вам средства на ваш счёт.</li>
                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px">4. Наслаждайтесь преимуществами инвестирования в одно из самых желанных мест.</li>
<!--                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px">При потере ключа или подозрении на его компрометацию, немедленно свяжитесь с нами.</li>-->
<!--                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px">Регулярно проверяйте ваш email на наличие обновлений или важных сообщений от нашей компании.</li>-->
                                                                </ul>
<!--                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Если у вас возникнут вопросы или вам понадобится помощь, наша команда профессионалов всегда к вашим услугам.<br><br></p>-->
<!--                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Мы здесь, чтобы поддерживать вас на каждом этапе вашего инвестиционного пути.<br><br></p>-->
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="es-m-txt-l" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px" align="left"><img src="https://i.imgur.com/akww31j.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="95"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <table class="es-content" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                    <tr>
                        <td align="center" style="padding:0;Margin:0">
                            <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                    <td align="left" style="padding:20px;Margin:0">

                                        <table style="width:560px" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width:115px" valign="top">

                                        <table class="es-left" cellspacing="0" cellpadding="0" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                            <tr>
                                                <td align="left" style="padding:0;Margin:0;width:115px">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td class="es-m-txt-c" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0px" align="right"><img src="https://i.imgur.com/aTE6evt.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="115" height="115"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                        </td>
                                        <td style="width:20px"></td>
                                        <td style="width:425px" valign="top">

                                        <table class="es-right" cellspacing="0" cellpadding="0" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                                            <tr>
                                                <td align="left" style="padding:0;Margin:0;width:425px">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td class="es-m-txt-c" align="left" style="padding:0;Margin:0">
                                                                <h3 style="padding-top:15px;Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Customer Support</h3>
                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#333333;font-size:14px;line-height:21px" href="tel:+357 22 761795">+357 22 761795</a></p>
                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><a target="_blank" href="mailto:support@apatecyprusestate.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:14px;line-height:21px">support@apatecyprusestate.com</a></p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td class="es-m-txt-c" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0" align="left">
                                                                <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px"><a href="https://www.instagram.com/apatecyprusestate/"><img title="Instagram" src="https://i.imgur.com/Xl0LvdX.png" alt="Inst" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                                                        <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px"><a href="https://www.youtube.com/@apatecyprusestate" ><img title="Youtube" src="https://i.imgur.com/uGFx5YY.png" alt="Youtube" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                                                        <td valign="top" align="center" style="padding:0;Margin:0"><a href="https://t.me/apatenews"><img title="Telegram" src="https://i.imgur.com/dQfFsEj.png" alt="Telegram" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        </td>
                                        </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
</body>`,
    });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/sendEmail", async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to,
      subject,
      html,
    });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/register", async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to,
      subject,
      html,
    });

    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/ip", async (req, res) => {
  try {
    const { username } = req.body;
    const userDoc = await db.collection("users").doc(username);
    const userSnap = await userDoc.get();
    const userAgent = req.useragent;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const parsedIP = ip.replace("::ffff:", "");
    const result = detector.detect(userAgent.source);

    if (userSnap.exists) {
      const userData = await userSnap.data();
      const geoByIp = geoip.lookup(parsedIP);
      const userBackendInfo = userData.backendInfo;

      if (userBackendInfo) {
        const userHasIp = userBackendInfo.some((info) => info.ip === parsedIP);

        console.log(userBackendInfo, "userBackendInfo");
        console.log(userHasIp, "userHasIp");

        if (userHasIp) {
          res.send("the user has already logged in from this IP address");
          return;
        }

        await userDoc.update({
          backendInfo: FieldValue.arrayUnion({
            ip: parsedIP,
            country: geoByIp.country,
            city: geoByIp.city,
            ...result,
          }),
        });
      } else {
        await userDoc.update({
          backendInfo: [
            {
              ip: parsedIP,
              geo: geoByIp,
              ...result,
            },
          ],
        });
      }
    }

    res.send(ip);
  } catch (e) {
    console.log(e, "error");
  }
});

const server = http.createServer(app);
server.listen(8000, "localhost", () => {
  console.log(`Server is running on http://localhost:${8000}`);
});

// https.createServer(httpsOptions, app).listen(8000, () => {
//   console.log("listen2");
// });
