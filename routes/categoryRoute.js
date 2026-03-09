import express from "express";
import { getCategory, createCategory, getCategoryById, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getCategory);
router.get("/:id", getCategoryById);

router.post("/", protect, authorizeRoles("librarian", "admin"), createCategory);
router.post("/:id/update", protect, authorizeRoles("librarian", "admin"), updateCategory);
router.post("/:id/delete", protect, authorizeRoles("librarian", "admin"), deleteCategory);

export default router;
