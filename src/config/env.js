import { config } from "dotenv";

config();

export const env = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  MAILING_SERVICE: process.env.MAILING_SERVICE,
  MAILING_PORT: process.env.MAILING_PORT,
};
