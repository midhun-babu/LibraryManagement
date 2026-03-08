import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

// ===================================
// Login Controller
// ===================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("auth/login", { title: "Login", error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/login", { title: "Login", error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("auth/login", { title: "Login", error: "Invalid email or password" });
    }

    // Create token and set cookie
    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/"); // redirect to dashboard
  } catch (error) {
    res.render("auth/login", { title: "Login", error: "Server error" });
  }
};

// ===================================
// Register Controller
// ===================================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword });

    res.redirect("/auth/login"); // after registration, go to login
  } catch (error) {
    res.render("auth/register", { title: "Register", error: "Registration failed" });
  }
};