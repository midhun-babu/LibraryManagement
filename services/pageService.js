import Book from "../models/book.js";
import User from "../models/user.js";
import Category from "../models/category.js";

// Get homepage stats
export const getHomeStats = async () => {
  const bookCount = await Book.countDocuments();
  const userCount = await User.countDocuments();
  const categoryCount = await Category.countDocuments();

  return { bookCount, userCount, categoryCount };
};
