import Category from "../model/category.js";

// Create
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    console.log(category)
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read 
export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false }).populate("category");
    res.status(200).json({mesasge: "Call readched",categories:"categories" });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read 
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("category");
    if (!category || category.isDeleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Category updated", category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete 
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.json({ message: "Category deleted", category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
