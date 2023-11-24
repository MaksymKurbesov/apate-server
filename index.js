import express from "express";
import useragent from "express-useragent";
import nodemailer from "nodemailer";
import cors from "cors";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

import fs from "fs";
import https from "https";
import http from "http";

const firestoreApp = initializeApp();
const db = getFirestore();

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
app.use(
  cors({
    origin: ["https://apatecyprusestate.com", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

app.options("*", cors());
app.enable("trust proxy");

const httpsOptions = {
  cert: fs.readFileSync("ssl/apate.crt"),
  key: fs.readFileSync("ssl/apate.key"),
  ca: fs.readFileSync("ssl/apate.ca-bundle"),
};

// app.use((req, res, next) => {
// 	if(req.protocol === 'http') {
// 		res.redirect(301, `https://${req.headers.host}${req.url}`);
// 	}
// 	next();
// });

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

  if (userSnap.exists) {
    const userData = await userSnap.data();
    if (userData.backendInfo?.ip !== ip) {
      await userDoc.update({
        backendInfo: FieldValue.arrayUnion({
          ip,
        }),
      });
    }
  }

  res.send(ip);
});

// app.listen(3333, () => {
// 	console.log('listen')
// })

https.createServer(httpsOptions, app).listen(8000, () => {
  console.log("listen2");
});

http.createServer(app).listen(80, () => {
  console.log("listen");
});
