import { Router } from "express";
import { customPassportCall } from "../utils.js";
import { register, login, current, logout, adminTest, recoverPassword, resetPassword } from "../controllers/sessions.controller.js";
import { isLoggedIn, checkAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// 📝 REGISTER

router.post("/register", customPassportCall("register"), register);

// 🔑 LOGIN

router.post("/login", customPassportCall("login"), login);

// 👤 CURRENT
router.get("/current", customPassportCall("current"), isLoggedIn, current);

// 🚪 LOGOUT
router.post("/logout", customPassportCall("current"), isLoggedIn, logout);

// 🔐 ADMIN
router.get("/admin-test", customPassportCall("current"), isLoggedIn, checkAdmin, adminTest);

// 🔐 RECOVER PASSWORD
router.post("/recover-password", recoverPassword);

// 🔐 RESET PASSWORD
router.post("/reset-password", resetPassword);

export default router;
