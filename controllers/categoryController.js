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
    const { name,description } = req.body;
   

    if (!name || !description) {return res.status(400).send("Category name and description is required");}
    
    await createCategoryService(req.body);
    res.redirect("/category");
  } catch (err) {
     console.log("req.body:", req.body);
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
//views form
export const getCreateCategoryForm = async (req, res) => {
  try {
    
    const { categories } = await getCategoryService();

    
    res.render('category/form', {
      title: 'Add Category',
      categories,   
      book: null   
    });
  } catch (err) {
    console.error('Error loading category form:', err);
    res.status(500).send('Error loading form');
  }
};
