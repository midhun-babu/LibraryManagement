import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// Render Login Page
router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

// Render Register Page
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" });
});

// Handle Login Form POST
router.post("/login", login);

// Handle Register Form POST
router.post("/register", register);

export default router;