import User from "../model/user.js";

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: "user created", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "user updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true },
    );
    res.json({ message: "user deleted", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
