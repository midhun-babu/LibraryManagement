import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


// ===================================
// Generate JWT Token
// ===================================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};


// ===================================
// Login Controller
// ===================================
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.send("Email and password required");
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.send("Invalid email or password");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Invalid email or password");
    }

    // Generate token
    const token = generateToken(user._id);

    // Save token in cookie
    res.cookie("token", token, {
      httpOnly: true
    });

    // Redirect after login
    res.redirect("/auth/profile");

  } catch (error) {

    res.status(500).send("Server error");

  }
};



// ===================================
// Register Controller
// ===================================
export const register = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.redirect("/auth/login");

  } catch (error) {

    res.status(500).send("Registration failed");

  }
};