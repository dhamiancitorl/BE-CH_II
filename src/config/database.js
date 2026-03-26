import { connect } from "mongoose";
import { env } from "./env.js";

export async function mongoConnect() {
  try {
    await connect(env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error conectando MongoDB:", error);
  }
}
