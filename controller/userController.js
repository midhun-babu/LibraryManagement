import User from "../model/user.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "User created",
      user: userObj,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -----------------------------
// Get all users (with pagination)
// -----------------------------
export const getUsers = async (req, res) => {
  try {
    // Get page and limit from query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Fetch users that are not soft deleted
    const users = await User.find({ isDeleted: false })
      .select("-password") // hide password field
      .skip((page - 1) * limit) // pagination skip
      .limit(limit); // pagination limit

    // Count total users
    const total = await User.countDocuments({ isDeleted: false });

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// Get a single user by ID
// -----------------------------
export const getUserById = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id).select("-password");

    // If user doesn't exist or is deleted
    if (!user || user.isDeleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// Update user information
// -----------------------------
export const updateUser = async (req, res) => {
  try {
    // Update only if user is not deleted
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -----------------------------
// Soft delete a user
// -----------------------------
export const deleteUser = async (req, res) => {
  try {
    // Instead of removing permanently, mark as deleted
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -----------------------------
// Restore a soft-deleted user
// -----------------------------
export const restoreUser = async (req, res) => {
  try {
    // Change isDeleted flag back to false
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User restored",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
