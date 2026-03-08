import Book from "../models/book.js";
import Category from "../models/category.js";
import User from "../models/user.js";

export const dashboardController = async (req, res) => {
  try {
    // Get counts
    const bookCount = await Book.countDocuments({ isDeleted: false });
    const categoryCount = await Category.countDocuments({ isDeleted: false });
    const userCount = await User.countDocuments({ isDeleted: false });

    // Render dashboard with variables
    res.render("index", {
      user: req.user,          // from authMiddleware
      bookCount,
      categoryCount,
      userCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};