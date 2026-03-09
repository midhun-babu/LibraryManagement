import express from "express";
import {
  getCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all categories (list page)
router.get("/", getCategory);

// Create category (POST)
router.post("/", protect, authorizeRoles("librarian", "admin"), createCategory);

// Update category
router.post(
  "/:id/update",
  protect,
  authorizeRoles("librarian", "admin"),
  updateCategory,
);

// Delete category (soft delete)
router.post(
  "/:id/delete",
  protect,
  authorizeRoles("librarian", "admin"),
  deleteCategory,
);

// Get category by ID (DETAILS page) — keep LAST
router.get("/:id", getCategoryById);

export default router;
