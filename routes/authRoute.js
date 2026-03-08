import express from "express";
import { login, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==============================
// Render Auth Pages
// ==============================

// Login page
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Register page
router.get("/register", (req, res) => {
  res.render("auth/register");
});


// ==============================
// Form Actions
// ==============================

// Handle login form
router.post("/login", login);

// Handle register form
router.post("/register", register);


// ==============================
// Protected Profile Page
// ==============================

router.get("/profile", protect, (req, res) => {
  res.render("user/profile", {
    user: req.user
  });
});


export default router;