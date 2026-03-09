// services/dashboardService.js
import Book from "../models/book.js";
import Category from "../models/category.js";
import User from "../models/user.js";

// Get dashboard stats
export const getDashboardStats = async () => {
  const bookCount = await Book.countDocuments({ isDeleted: false });
  const categoryCount = await Category.countDocuments({ isDeleted: false });
  const userCount = await User.countDocuments({ isDeleted: false });

  return { bookCount, categoryCount, userCount };
};
