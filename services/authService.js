import User from "../models/user.js"; // Ensure path is correct
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });


export const findUserByIdentifier = (identifier) => {
  return User.findOne({ 
    $or: [{ email: identifier }, { uname: identifier }] 
  });
};


export const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};


export const createUser = async ({ name, uname, email, password, role }) => {
  
  return await User.create({ 
    name, 
    uname, 
    email, 
    password, 
    role: role || "user" 
  });
};


export const createToken = (userId) => {
  return generateToken(userId);
};
