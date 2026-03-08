import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const protect = async (req, res, next) => {
  try {

    const token = req.cookies?.token;

    // No token
    if (!token) {
      return res.redirect("/auth/login");
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.redirect("/auth/login");
    }

    // Attach user
    req.user = user;

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.redirect("/auth/login");
  }
};