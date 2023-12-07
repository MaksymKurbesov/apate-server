import express from "express";
import useragent from "express-useragent";
import nodemailer from "nodemailer";
import cors from "cors";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import DeviceDetector from "node-device-detector";
import fs from "fs";
import https from "https";
import geoip from "geoip-lite";

const firestoreApp = initializeApp();
const db = getFirestore();

const TEST_EMAILS = ["probuisness90@gmail.com", "bonyklade@gmail.com"];

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

const supportEmail = "support@apatecyprusestate.com";
const supportEmailPassword = "trewQ!2345";

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

app.enable("trust proxy");

const httpsOptions = {
  cert: fs.readFileSync("ssl/apate.crt"),
  key: fs.readFileSync("ssl/apate.key"),
  ca: fs.readFileSync("ssl/apate.ca-bundle"),
};

app.post("/sendEmailToAll", async (req, res) => {
  try {
    await mailTransport.sendMail({
      from: `Apate Cyprus Estate Support <${supportEmail}>`,
      to: ``,
      bcc: TEST_EMAILS,
      subject: "Акция!",
      html:
        "<body style=\"width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0\">\n" +
        '    <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA">\n' +
        '    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">\n' +
        "        <tr>\n" +
        '            <td valign="top" style="padding:0;Margin:0">\n' +
        '                <table class="es-header" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">\n' +
        "                    <tr>\n" +
        '                        <td align="center" style="padding:0;Margin:0">\n' +
        '                            <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">\n' +
        "                                <tr>\n" +
        '                                    <td align="left">\n' +
        '                                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
        "                                            <tr>\n" +
        '                                                <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:560px">\n' +
        '                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
        '                                                        <tr style="position:relative">\n' +
        '                                                            <td style="padding:0;Margin:0;padding-bottom:20px;padding-top:115px;font-size:0px" align="center"><img src="https://i.imgur.com/JuRVpxa.png" alt="Logo" style="position:absolute;display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;font-size:12px" title="Logo" width="100%"></td>\n' +
        '                                                            <td style="padding:0;Margin:0;padding-bottom:20px;padding-top:115px;font-size:0px" align="center"><img src="https://i.imgur.com/kKfOFNL.png" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;font-size:12px" title="Logo" width="200" height="48"></td>\n' +
        "                                                        </tr>\n" +
        "                                                        <tr>\n" +
        '                                                            <td style="padding:0;Margin:0">\n' +
        '                                                                <table class="es-menu" width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
        '                                                                    <tr class="links">\n' +
        '                                                                        <td style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0" width="50%" valign="top" align="center"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, \'helvetica neue\', helvetica, sans-serif;color:#666666;font-size:14px">+357 22 761795</a></td>\n' +
        '                                                                        <td style="Margin:0;padding-left:5px;padding-right:5px;padding-top:15px;padding-bottom:15px;border:0" width="50%" valign="top" align="center"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, \'helvetica neue\', helvetica, sans-serif;color:#666666;font-size:14px">support@apatecyprusestate.com</a></td>\n' +
        "                                                                    </tr>\n" +
        "                                                                </table>\n" +
        "                                                            </td>\n" +
        "                                                        </tr>\n" +
        "                                                    </table>\n" +
        "                                                </td>\n" +
        "                                            </tr>\n" +
        "                                        </table>\n" +
        "                                    </td>\n" +
        "                                </tr>\n" +
        "                            </table>\n" +
        "                        </td>\n" +
        "                    </tr>\n" +
        "                </table>\n" +
        '                <table class="es-content" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">\n' +
        "                    <tr>\n" +
        '                        <td align="center" style="padding:0;Margin:0">\n' +
        '                            <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;border-top:10px solid #7957FF;width:600px;border-bottom:10px solid #7957FF" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none">\n' +
        "                                <tr>\n" +
        '                                    <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:30px">\n' +
        '                                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
        "                                            <tr>\n" +
        '                                                <td valign="top" align="center" style="padding:0;Margin:0;width:560px">\n' +
        '                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
        "                                                        <tr>\n" +
        '                                                            <td align="left" style="padding:0;Margin:0">\n' +
        "                                                                <p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px\">${new Date().toLocaleDateString(\n" +
        '                                                                    "ru-RU"\n' +
        "                                                                    )}</p>\n" +
        "                                                            </td>\n" +
        "                                                        </tr>\n" +
        "                                                    </table>\n" +
        "                                                </td>\n" +
        "                                            </tr>\n" +
        "                                        </table>\n" +
        "                                    </td>\n" +
        "                                </tr>\n" +
        "                                <tr>\n" +
        '                                    <td style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;background-image:url(https://i.imgur.com/4OM6MoB.png);background-repeat:no-repeat;background-position:center" background="https://i.imgur.com/4OM6MoB.png" align="left">\n' +
        '                                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
        "                                            <tr>\n" +
        '                                                <td valign="top" align="center" style="padding:0;Margin:0;width:560px">\n' +
        '                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
        "                                                        <tr>\n" +
        '                                                            <td class="es-m-txt-l" align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:10px">\n' +
        "                                                                <h3 style=\"Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#7957FF\">Здравствуйте ${userNickname},</h3>\n" +
        "                                                            </td>\n" +
        "                                                        </tr>\n" +
        "                                                        <tr>\n" +
        '                                                            <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:10px">\n' +
        "                                                                <p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px\">Мы рады сообщить вам о запуске уникальной акции от <b>Apate Cyprus Estate!</b> В рамках нашего стремления к инновациям и предоставлению выгодных возможностей для наших клиентов, мы предлагаем вам эксклюзивное предложение.<br><br></p>\n" +
        "                                                                <p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:30px;color:#0d2035;font-size:24px;text-align: center\"><b><i>Пополните личный кабинет и получите +10% бонуса на ваш счет!</i></b><br><br></p>\n" +
        '                                                                <div style="font-size: 24px;font-weight: 600;text-align: center;background: #f0f0f0;width: 50%;padding: 20px;margin:0 auto;border-radius: 10px;color: #7957FF;">\n' +
        "                                                                    Промокод: ApateMerryXmas2024\n" +
        "                                                                </div><br><br>\n" +
        "                                                                <p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px\">Это идеальная возможность для тех, кто ищет выгодные инвестиции в недвижимость и хочет расширить свой инвестиционный портфель. <br><br></p>\n" +
        "<!--                                                                <p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px\">Не забудьте ознакомиться с нашими аналитическими отчетами и рыночными обзорами, которые помогут вам принимать обоснованные решения.</p><br>-->\n" +
        "                                                                <h3>Как это работает?</h3>\n" +
        '                                                                <ul style="list-style: none">\n' +
        '                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px">1. На сайте компании в разделе <b>"Пополнить счёт"</b> выберите любой удобный для вас способ оплаты.</li>\n' +
        '                                                                    <li style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px">2. При пополнение счёта, на сайте, в поле <b>"Номер транзакции"</b> добавьте через точку с запятой (;) выше указанный промокод.</li>\n' +
        "                                                                    <li style=\"-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px\">3. Мы автоматически начислем вам средства на ваш счёт.</li>\n" +
        "                                                                    <li style=\"-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px\">3. Наслаждайтесь преимуществами инвестирования в одно из самых желанных мест.</li>\n" +
        "<!--                                                                    <li style=\"-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px\">При потере ключа или подозрении на его компрометацию, немедленно свяжитесь с нами.</li>-->\n" +
        "<!--                                                                    <li style=\"-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;Margin-bottom:15px;margin-left:0;color:#333333;font-size:14px\">Регулярно проверяйте ваш email на наличие обновлений или важных сообщений от нашей компании.</li>-->\n" +
        "                                                                </ul>\n" +
        "<!--                                                                <p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px\">Если у вас возникнут вопросы или вам понадобится помощь, наша команда профессионалов всегда к вашим услугам.<br><br></p>-->\n" +
        "<!--                                                                <p style=\"Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px\">Мы здесь, чтобы поддерживать вас на каждом этапе вашего инвестиционного пути.<br><br></p>-->\n" +
        "                                                            </td>\n" +
        "                                                        </tr>\n" +
        "                                                        <tr>\n" +
        '                                                            <td class="es-m-txt-l" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px" align="left"><img src="https://i.imgur.com/akww31j.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="95"></td>\n' +
        "                                                        </tr>\n" +
        "                                                    </table>\n" +
        "                                                </td>\n" +
        "                                            </tr>\n" +
        "                                        </table>\n" +
        "                                    </td>\n" +
        "                                </tr>\n" +
        "                            </table>\n" +
        "                        </td>\n" +
        "                    </tr>\n" +
        "                </table>\n" +
        '                <table class="es-content" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">\n' +
        "                    <tr>\n" +
        '                        <td align="center" style="padding:0;Margin:0">\n' +
        '                            <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">\n' +
        "                                <tr>\n" +
        '                                    <td align="left" style="padding:20px;Margin:0">\n' +
        "\n" +
        '                                        <table style="width:560px" cellpadding="0" cellspacing="0">\n' +
        "                                            <tr>\n" +
        '                                                <td style="width:115px" valign="top">\n' +
        "\n" +
        '                                        <table class="es-left" cellspacing="0" cellpadding="0" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">\n' +
        "                                            <tr>\n" +
        '                                                <td align="left" style="padding:0;Margin:0;width:115px">\n' +
        '                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
        "                                                        <tr>\n" +
        '                                                            <td class="es-m-txt-c" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0px" align="right"><img src="https://i.imgur.com/aTE6evt.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="115" height="115"></td>\n' +
        "                                                        </tr>\n" +
        "                                                    </table>\n" +
        "                                                </td>\n" +
        "                                            </tr>\n" +
        "                                        </table>\n" +
        "\n" +
        "                                        </td>\n" +
        '                                        <td style="width:20px"></td>\n' +
        '                                        <td style="width:425px" valign="top">\n' +
        "\n" +
        '                                        <table class="es-right" cellspacing="0" cellpadding="0" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">\n' +
        "                                            <tr>\n" +
        '                                                <td align="left" style="padding:0;Margin:0;width:425px">\n' +
        '                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
        "                                                        <tr>\n" +
        '                                                            <td class="es-m-txt-c" align="left" style="padding:0;Margin:0">\n' +
        "                                                                <h3 style=\"padding-top:15px;Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px\">Customer Support</h3>\n" +
        '                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#333333;font-size:14px;line-height:21px" href="tel:+357 22 761795">+357 22 761795</a></p>\n' +
        '                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><a target="_blank" href="mailto:support@apatecyprusestate.com" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:14px;line-height:21px">support@apatecyprusestate.com</a></p>\n' +
        "                                                            </td>\n" +
        "                                                        </tr>\n" +
        "                                                        <tr>\n" +
        '                                                            <td class="es-m-txt-c" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0" align="left">\n' +
        '                                                                <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">\n' +
        "                                                                    <tr>\n" +
        '                                                                        <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px"><a href="https://www.instagram.com/apatecyprusestate/"><img title="Instagram" src="https://i.imgur.com/Xl0LvdX.png" alt="Inst" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>\n' +
        '                                                                        <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px"><a href="https://www.youtube.com/@apatecyprusestate" ><img title="Youtube" src="https://i.imgur.com/uGFx5YY.png" alt="Youtube" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>\n' +
        '                                                                        <td valign="top" align="center" style="padding:0;Margin:0"><a href="https://t.me/apatenews"><img title="Telegram" src="https://i.imgur.com/dQfFsEj.png" alt="Telegram" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>\n' +
        "                                                                    </tr>\n" +
        "                                                                </table>\n" +
        "                                                            </td>\n" +
        "                                                        </tr>\n" +
        "                                                    </table>\n" +
        "                                                </td>\n" +
        "                                            </tr>\n" +
        "                                        </table>\n" +
        "                                        </td>\n" +
        "                                        </tr>\n" +
        "                                        </table>\n" +
        "                                    </td>\n" +
        "                                </tr>\n" +
        "                            </table>\n" +
        "                        </td>\n" +
        "                    </tr>\n" +
        "                </table>\n" +
        "            </td>\n" +
        "        </tr>\n" +
        "    </table>\n" +
        "</div>\n" +
        "</body>",
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

app.post("/", async (req, res) => {
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

    if (!userData.backendInfo) {
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

    if (userData.backendInfo) {
      const lastUserIP =
        userData.backendInfo[userData.backendInfo.length - 1].ip;

      if (lastUserIP !== parsedIP) {
        await userDoc.update({
          backendInfo: FieldValue.arrayUnion({
            ip: parsedIP,
            geo: geoByIp,
            ...result,
          }),
        });
      }
    }
  }

  res.send(ip);
});

https.createServer(httpsOptions, app).listen(8000, () => {
  console.log("listen2");
});
