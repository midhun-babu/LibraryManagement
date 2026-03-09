import {
  createCategoryService,
  getCategoryService, 
  getCategoryByIdService,
  updateCategoryService,
  softDeleteCategoryService
} from "../services/categoryService.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send("Category name is required");
    
    await createCategoryService(req.body);
    res.redirect("/category");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const getCategory = async (req, res) => {
  try {
    // Calling the renamed service function
    const categories = await getCategoryService(); 
    res.render("category/index", { title: "Categories", categories });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await getCategoryByIdService(req.params.id);
    if (!category || category.isDeleted) {
      return res.status(404).send("Category not found");
    }
    res.render("category/show", { title: "Category Details", category });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    await updateCategoryService(req.params.id, req.body);
    res.redirect("/category");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await softDeleteCategoryService(req.params.id);
    res.redirect("/category");
  } catch (err) {
    res.status(400).send(err.message);
  }
};
