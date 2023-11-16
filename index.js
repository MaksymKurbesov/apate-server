import express from 'express';
import useragent from 'express-useragent';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";

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
app.use(cors({ origin: 'http://localhost:3000/', credentials:true, optionSuccessStatus:200 }));
app.use(express.json());

app.post('/register', async (req, res) => {
	const userData = await db.collection('users').doc('admin').get();
	let userAgentInfo = req.useragent;

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

app.listen(3333, () => {
	console.log('Application listening on port 3333!');
});