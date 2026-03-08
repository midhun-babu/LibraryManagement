import Book from "../model/book.js";
import Category from "../model/category.js";
import User from "../model/user.js";

export const getDashboard = async (req, res) => {
  try {
    const books = await Book.find();
    const categories = await Category.find();
    const users = await User.find();

    res.render("dashboard", {
      title: "Dashboard",
      books,
      categories,
      users
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
