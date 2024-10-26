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
import Queue from "bull";

import { deleteAcc } from "./deleteAcc.js";
import Stripe from "stripe";

const firestoreApp = initializeApp();
const db = getFirestore();

const stripe = new Stripe(
  "sk_test_51Q7ytVP1NPhNMqcm2D1x4mX1UQV3NwFKTaoEkzPL0BiMyoIPB139F6eTcque1qXKlN3ZkZyeWwg9OOPRS1AeT83S000F6juaLa",
);

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

const YOUR_DOMAIN = "https://littlebear-app.site";

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1QDteZP1NPhNMqcm0wix9bI6",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/fortune-wheel?success=true`,
    cancel_url: `${YOUR_DOMAIN}/fortune-wheel?canceled=true`,
    automatic_tax: { enabled: true },
  });

  res.redirect(303, session.url);
});

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

app.post("/");

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
