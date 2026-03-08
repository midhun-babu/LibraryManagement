import express from "express";
import Book from "../models/book.js";
import Category from "../models/category.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const bookCount = await Book.countDocuments();
    const categoryCount = await Category.countDocuments();
    const userCount = await User.countDocuments();

    res.render("index", {
      title: "Dashboard",
      bookCount,
      categoryCount,
      userCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;