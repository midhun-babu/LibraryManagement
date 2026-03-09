import mongoose from "mongoose";
import {
  createCategoryService,
  getCategoryService,
  getCategoryByIdService,
  updateCategoryService,
  softDeleteCategoryService,
} from "../services/categoryService.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send("Category name is required");

    await createCategoryService(req.body);
    res.redirect("/category");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error creating category");
  }
};

// Get all categories (with pagination)
export const getCategory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { categories, total } = await getCategoryService({ page, limit });
    const totalPages = Math.ceil(total / limit) || 1;

    try {
      res.render("category/index", {
        title: "Categories",
        categories,
        pagination: { page, limit, total, totalPages },
      });
    } catch (renderErr) {
      console.error("Render error:", renderErr);
      res.status(500).send("Error rendering categories");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading categories");
  }
};

// Get Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Category ID");
    }

    const category = await getCategoryByIdService(id);

    if (!category || category.isDeleted) {
      return res.status(404).send("Category not found");
    }

    res.render("category/show", { title: "Category Details", category });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving category");
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Category ID");
    }

    if (!req.body.name) {
      return res.status(400).send("Category name is required");
    }

    const updated = await updateCategoryService(id, req.body);

    if (!updated) {
      return res.status(404).send("Category not found");
    }

    res.redirect("/category");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error updating category");
  }
};

// Soft Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Category ID");
    }

    const deleted = await softDeleteCategoryService(id);

    if (!deleted) {
      return res.status(404).send("Category not found");
    }

    res.redirect("/category");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error deleting category");
  }
};
