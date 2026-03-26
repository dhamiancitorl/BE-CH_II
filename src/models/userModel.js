import { model, Schema } from "mongoose";

const userSchema = new Schema({
  first_name: String,
  last_name: String,
  email: {
    unique: true,
    type: String,
    required: true,
  },
  age: Number,
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

export const userModel = model("User", userSchema);
