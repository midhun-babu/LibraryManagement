import Category from "../models/category.js";

// Create Category
export const createCategoryService = async (data) => {
  const category = new Category(data);
  return await category.save();
};

// Get categories with optional pagination
export const getCategoryService = async (options = {}) => {
  const { page = 1, limit = 10 } = options;
  const query = { isDeleted: false };
  const skip = (Number(page) - 1) * Number(limit);

  const [categories, total] = await Promise.all([
    Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(), // lean for performance
    Category.countDocuments(query),
  ]);

  return { categories, total };
};

// Get category by ID (only if not deleted)
export const getCategoryByIdService = async (id) => {
  return await Category.findOne({ _id: id, isDeleted: false }).lean();
};

// Update category
export const updateCategoryService = async (id, updateData) => {
  return await Category.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { new: true, runValidators: true }, // ensure schema validation
  );
};

// Soft delete category
export const softDeleteCategoryService = async (id) => {
  return await Category.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );
};
