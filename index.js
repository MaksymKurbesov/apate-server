import express from "express";
import useragent from "express-useragent";
import nodemailer from "nodemailer";
import cors from "cors";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import DeviceDetector from "node-device-detector";
import fs from "fs";
import https from "https";

const firestoreApp = initializeApp();
const db = getFirestore();

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

app.post("/sendEmail", async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    await mailTransport.sendMail({
      from: `Support <${supportEmail}>`,
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
      from: `Support <${supportEmail}>`,
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
    const lastUserIP =
      userData.backendInfo[userData.backendInfo.length - 1]?.ip;

    if (!userData.backendInfo) {
      await userDoc.update({
        backendInfo: [
          {
            ip: parsedIP,
            ...result,
          },
        ],
      });
    }

    if (lastUserIP !== parsedIP) {
      await userDoc.update({
        backendInfo: FieldValue.arrayUnion({
          ip: parsedIP,
          ...result,
        }),
      });
    }
  }

  res.send(ip);
});

https.createServer(httpsOptions, app).listen(8000, () => {
  console.log("listen2");
});
