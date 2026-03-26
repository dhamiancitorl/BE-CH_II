import { generateToken } from "../utils.js";
import { UserDTO } from "../models/dto/userDTO.js";
import { sendWelcomeEmail } from "../services/mail.services.js";
import { userService } from "../services/user.services.js";

// 📝 REGISTER
export const register = (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .json({ error: "Error al registrar el usuario ya existe" });
  }
  const userDTO = new UserDTO();
  const userSafe = userDTO.sessionData(req.user);
  sendWelcomeEmail(userSafe.email, userSafe.first_name);
  res.status(200).json({
    message: "Usuario registrado correctamente",
    user: userSafe,
  });
};

// 🔑 LOGIN
export const login = (req, res) => {
  if (!req.user) {
    return res.status(400).json({ error: "Credenciales incorrectas" });
  }
  const userDTO = new UserDTO();
  const userSafe = userDTO.sessionData(req.user);
  const token = generateToken(userSafe);

  res.cookie("jwt", token, { httpOnly: true }).json({
    message: "Usuario logueado correctamente",
    user: userSafe,
  });
};
// 👤 CURRENT
export const current = (req, res) => {
  const userDTO = new UserDTO();
  const userSafe = userDTO.sessionData(req.user);
  res.json({ user: userSafe });
};
// 🚪 LOGOUT
export const logout = (req, res) => {
  res.clearCookie("jwt").json({ message: "Logout exitoso" });
};

// 🔐 ADMIN TEST
export const adminTest = (req, res) => {
  res.json({ message: "Acceso concedido al panel de administración" });
};

export const recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const message = await userService.processPasswordRecovery(email);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: "Error al recuperar la contraseña" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const message = await userService.processResetPassword(token, newPassword);
    res.status(200).json({ message });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Error al restablecer contraseña" });
  }
};
