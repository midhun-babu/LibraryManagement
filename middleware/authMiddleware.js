import jwt from "jsonwebtoken";
import User from "../models/user.js";

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
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.redirect("/auth/login");
  }
};

export const setUser = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.locals.user = null;
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    

    req.user = user;
    res.locals.user = user; 
    next();
  } catch (error) {
    res.locals.user = null;
    req.user = null;
    next();
  }
};
