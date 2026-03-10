import express from "express";
import {
  getCategory,
  getCreateCategoryForm,
  createCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all categories (list page)
router.get("/", getCategory);

// Create category (POST)
router.get("/form", protect, authorizeRoles("librarian", "admin"), getCreateCategoryForm);
router.post("/", protect, authorizeRoles("librarian", "admin"), createCategory);


// Delete category (soft delete)
router.post(
  "/:id/delete",
  protect,
  authorizeRoles("librarian", "admin"),
  deleteCategory,
);


export default router;
