import Category from "../models/category.js";

// Create category
export const createCategoryService = async (data) => {
  return await Category.create(data);
};

// Returns categories
export const getCategoryService = async () => {
  return await Category.find({ isDeleted: false });
};

// Get category by ID
export const getCategoryByIdService = async (id) => {
  return await Category.findById(id);
};

// Update category
export const updateCategoryService = async (id, updateData) => {
  return await Category.findByIdAndUpdate(id, updateData, { new: true });
};

// Soft delete category
export const softDeleteCategoryService = async (id) => {
  return await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
};
