import User from "../models/user.js";
import bcrypt from "bcryptjs";

// Create user with hashed password
export const createUserService = async ({
  name,
  uname,
  email,
  password,
  role,
}) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return await User.create({
    name,
    uname,
    email,
    password: hashedPassword,
    role: role || "user",
  });
};
// Get all users
export const getAllUsers = async () => {
  return await User.find({ isDeleted: false }).select("-password");
};

// Get user by ID
export const getUserByIdService = async (id) => {
  return await User.findById(id).select("-password");
};

// Update user
export const updateUserService = async (id, updateData) => {
  return await User.findOneAndUpdate({ _id: id, isDeleted: false }, updateData);
};

// Soft delete user
export const softDeleteUserService = async (id) => {
  return await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
  );
};

// Restore user
export const restoreUserService = async (id) => {
  return await User.findByIdAndUpdate(id, { isDeleted: false });
};
