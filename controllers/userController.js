import {
  createUserService,
  getAllUsers,
  getUserByIdService,
  updateUserService,
  softDeleteUserService,
  restoreUserService,
} from "../services/userService.js";

// Create User
export const createUser = async (req, res) => {
  try {
    const { name, uname, email, password, role } = req.body;
    await createUserService({ name, uname, email, password, role });

    res.redirect("/users");
  } catch (err) {
    
    console.error("Mongoose Validation Error:", err.message);
    res.status(400).send("Error: " + err.message);
  }
};

// Get All Users
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.render("users/index", { title: "Users", users });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get User By ID
export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user || user.isDeleted) {
      return res.status(404).send("User not found");
    }
    res.render("users/show", { title: "User Details", user });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    await updateUserService(req.params.id, req.body);
    res.redirect("/users");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Soft Delete User
export const deleteUser = async (req, res) => {
  try {
    await softDeleteUserService(req.params.id);
    res.redirect("/users");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Restore User
export const restoreUser = async (req, res) => {
  try {
    await restoreUserService(req.params.id);
    res.redirect("/users");
  } catch (err) {
    res.status(400).send(err.message);
  }
};
