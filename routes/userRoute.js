import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.post("/:id/update", updateUser);
router.post("/:id/delete", deleteUser);
router.post("/:id/restore", restoreUser);

export default router;