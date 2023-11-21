import express from 'express';
import useragent from 'express-useragent';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";

import fs from 'fs';
import https from 'https';
import http from 'http';


const firestoreApp = initializeApp();
const db = getFirestore();

const supportEmail = 'support@apatecyprusestate.com';
const supportEmailPassword = 'trewQ!2345';

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
app.use(cors({ origin: ['https://apatecyprusestate.com', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

app.options('*', cors())

// const httpsOptions = {
// 	cert: fs.readFileSync('ssl/apate.crt'),
// 	ca: fs.readFileSync('ssl/apate.ca-bundle'),
// 	key: fs.readFileSync('ssl/apate.key'),
// }

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

app.post('/register', async (req, res) => {
	const userData = await db.collection('users').doc('admin').get();
	let userAgentInfo = req.useragent;

	try {
		const { to, subject, html } = req.body;

		const sendEmail = await mailTransport.sendMail({
			from: `Support <${supportEmail}>`,
			to,
			subject,
			html,
		});

		console.log(sendEmail, 'sendEmail')
		res.status(200).send("Email sent successfully");
	} catch (error) {
		console.error("Error sending email:", error);
		res.status(500).send("Failed to send email");
	}
});

app.listen(3333, () => { 
	console.log('listen')
})

// http.createServer(app).listen(80, () => {
// 	console.log('listen')
// });
// https.createServer(httpsOptions, app).listen(3333, () => {
// 	console.log('listen2')
// })
