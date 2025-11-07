import 'dotenv/config';
import nodemailer from "nodemailer";

// Optional safety: force Gmail if you set SMTP_FORCE_GMAIL=1
const wantGmail = String(process.env.SMTP_FORCE_GMAIL || "0") === "1";

const host = wantGmail ? "smtp.gmail.com" : (process.env.SMTP_HOST || "");
const port = wantGmail ? 465 : Number(process.env.SMTP_PORT || 587);
const secure = wantGmail ? true : !!Number(process.env.SMTP_SECURE || 0);

if (!host || ["localhost", "127.0.0.1"].includes(host)) {
  throw new Error(
    `SMTP_HOST is invalid ("${host}"). Set SMTP_HOST=smtp.gmail.com and SMTP_PORT=465, SMTP_SECURE=1, or set SMTP_FORCE_GMAIL=1.`
  );
}

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure, // true for 465 (SMTPS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true,
  debug: true,
});

export async function sendMail({ to, subject, html }) {
  const from =
    process.env.MAIL_FROM ||
    `"${process.env.APP_NAME || "App"}" <no-reply@localhost>`;
  return transporter.sendMail({ from, to, subject, html });
}
