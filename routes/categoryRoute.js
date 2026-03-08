import express from "express";
import {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../controller/categoryController.js";

const router = express.Router();

// Create category
router.post("/", createCategory);

// Get all categories
router.get("/", getCategory);

// Get single category
router.get("/:id", getCategoryById);

// Update category
router.put("/:id", updateCategory);

// Delete category
router.delete("/:id", deleteCategory);

export default router;