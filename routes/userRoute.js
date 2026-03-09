import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { canEditUser, authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "librarian"), getUsers);
router.post("/", protect, authorizeRoles("admin"), createUser);
router.get("/:id", protect, canEditUser, getUserById);
router.post("/:id/update", protect, canEditUser, updateUser);
router.post("/:id/delete", protect, canEditUser, deleteUser);
router.post("/:id/restore", protect, authorizeRoles("admin"), restoreUser);

export default router;
