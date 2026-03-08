import express from "express";
import {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategory);
router.post("/", createCategory);
router.get("/:id", getCategoryById);
router.post("/:id/update", updateCategory);
router.post("/:id/delete", deleteCategory);

export default router;