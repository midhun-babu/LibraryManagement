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
  const user = await User.findOne({ _id: id, isDeleted: false });

  if (!user) {
    throw new Error("User not found");
  }
  if (user.role === "admin" && updateData.role && updateData.role !== "admin") {
    const adminCount = await User.countDocuments({
      role: "admin",
      isDeleted: false,
    });

    if (adminCount <= 1) {
      throw new Error(
        "At least one admin must exist. Role change not allowed.",
      );
    }
  }

  return await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { new: true },
  );
};

// Soft delete user
export const softDeleteUserService = async (id) => {

  const user = await User.findOne({ _id: id, isDeleted: false });

  if (!user) {
    throw new Error("User not found");
  }

  // Prevent deleting the last admin
  if (user.role === "admin") {

    const adminCount = await User.countDocuments({
      role: "admin",
      isDeleted: false
    });

    if (adminCount <= 1) {
      throw new Error("At least one admin must exist. Deletion not allowed.");
    }
  }

  return await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
};
// Restore user
export const restoreUserService = async (id) => {
  return await User.findByIdAndUpdate(id, { isDeleted: false });
};
