import User from "../model/user.js";
import bcrypt from "bcryptjs";


// Create User
export const createUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.redirect("/users");

  } catch (err) {
    res.status(400).send(err.message);
  }
};



// Get All Users
export const getUsers = async (req, res) => {
  try {

    const users = await User
      .find({ isDeleted: false })
      .select("-password");

    res.render("users/index", {
      title: "Users",
      users
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
};



// Get User By ID
export const getUserById = async (req, res) => {
  try {

    const user = await User
      .findById(req.params.id)
      .select("-password");

    if (!user || user.isDeleted) {
      return res.status(404).send("User not found");
    }

    res.render("users/show", {
      title: "User Details",
      user
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
};



// Update User
export const updateUser = async (req, res) => {
  try {

    await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body
    );

    res.redirect("/users");

  } catch (err) {
    res.status(400).send(err.message);
  }
};



// Soft Delete User
export const deleteUser = async (req, res) => {
  try {

    await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true }
    );

    res.redirect("/users");

  } catch (err) {
    res.status(400).send(err.message);
  }
};



// Restore User
export const restoreUser = async (req, res) => {
  try {

    await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false }
    );

    res.redirect("/users");

  } catch (err) {
    res.status(400).send(err.message);
  }
};