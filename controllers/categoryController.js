import Category from "../model/category.js";


// Create Category
export const createCategory = async (req, res) => {
  try {

    await Category.create(req.body);

    res.redirect("/category");

  } catch (err) {
    res.status(400).send(err.message);
  }
};


// Get All Categories
export const getCategory = async (req, res) => {
  try {

    const categories = await Category.find({
      isDeleted: false
    });

    res.render("category/index", {
      title: "Categories",
      categories
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
};


// Get Category By ID
export const getCategoryById = async (req, res) => {
  try {

    const category = await Category.findById(req.params.id);

    if (!category || category.isDeleted) {
      return res.status(404).send("Category not found");
    }

    res.render("category/show", {
      title: "Category",
      category
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
};


// Update Category
export const updateCategory = async (req, res) => {
  try {

    await Category.findByIdAndUpdate(req.params.id, req.body);

    res.redirect("/category");

  } catch (err) {
    res.status(400).send(err.message);
  }
};


// Soft Delete Category
export const deleteCategory = async (req, res) => {
  try {

    await Category.findByIdAndUpdate(req.params.id, {
      isDeleted: true
    });

    res.redirect("/category");

  } catch (err) {
    res.status(400).send(err.message);
  }
};