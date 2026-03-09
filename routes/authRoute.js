// routes/authRoute.js
import express from "express";
import { login, register,logout } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", (req, res) => res.render("auth/login", { title: "Login" }));
router.post("/login", login);
router.get("/logout", logout);

router.get("/register", (req, res) => res.render("auth/register", { title: "Register" }));
router.post("/register", register);


export default router;
