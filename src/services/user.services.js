import { UserDAO } from "../models/dao/user.dao.js";
import { verifyPassword, hashPassword } from "../utils.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { sendPasswordResetEmail } from "./mail.services.js";

class UserService {
  constructor(dao) {
    this.dao = dao;
  }

  async register(userData) {
    const { email, password, first_name, last_name, age } = userData;
    const user = await this.dao.findByEmail(email);
    if (user) {
      throw new Error("User already exists");
    }
    const hashedPassword = hashPassword(password);
    return this.dao.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      age,
    });
  }

  async login(email, password) {
    const user = await this.dao.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return user;
  }

  async processPasswordRecovery(email) {
    const user = await this.dao.findByEmail(email);
    if (!user) {
      return "Si el correo está registrado, recibirás un enlace de recuperación";
    }
    const resetToken = jwt.sign({ email }, env.JWT_SECRET, { expiresIn: "1h" });
    await sendPasswordResetEmail(email, resetToken);
    return "Si el correo está registrado, recibirás un enlace de recuperación";
  }

  async processResetPassword(token, newPassword) {
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
      throw new Error("El token no es válido o ya caducó. Solicitá uno nuevo.");
    }
    const email = decodedToken.email;
    const user = await this.dao.findByEmail(email);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const samePassword = verifyPassword(newPassword, user.password);
    if (samePassword) {
      throw new Error("La nueva contraseña no puede ser igual a la anterior");
    }
    const newHashedPassword = hashPassword(newPassword);
    await this.dao.updatePassword(user.email, newHashedPassword);
    return "Contraseña actualizada correctamente";
  }
}

export const userService = new UserService(new UserDAO());
