import { Router } from "express";
import passport from "passport";
import { generateToken, customPassportCall } from "../utils.js";

const router = Router();

// 📝 REGISTER

router.post("/register", customPassportCall("register"), (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .json({ error: "Error al registrar el usuario-El usuario ya existe" });
  }
  res
    .status(200)
    .json({ message: "Usuario registrado correctamente", user: req.user });
});

// 🔑 LOGIN

router.post("/login", customPassportCall("login"), (req, res) => {
  if (!req.user) {
    return res.status(400).json({ error: "Credenciales incorrectas" });
  }
  const token = generateToken(req.user);
  const { password, ...userWithoutPassword } = req.user;

  res.cookie("jwt", token, { httpOnly: true }).json({
    message: "Usuario logueado correctamente",
    user: userWithoutPassword,
  });
});

// 👤 CURRENT
router.get("/current", customPassportCall("current"), (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json({ user: userWithoutPassword });
});

// 🚪 LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("jwt").json({ message: "Logout exitoso" });
});

export default router;
