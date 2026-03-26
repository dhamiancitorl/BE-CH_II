import nodemailer from "nodemailer";
import { env } from "./env.js";

const transporter = nodemailer.createTransport({
    service: env.MAILING_SERVICE,
    port: env.MAILING_PORT,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    }
})

export default transporter;