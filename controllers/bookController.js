import Book from "../models/book.js";


// Show all books
export const getBooks = async (req, res) => {
  try {

    const books = await Book
      .find({ isDeleted: false })
      .populate("category");

    res.render("books/index", {
      title: "Books",
      books
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
};



// Create book
export const createBook = async (req, res) => {
  try {

    const { title, author } = req.body;

    if (!title || !author) {
      return res.status(400).send("Title and Author required");
    }

    await Book.create(req.body);

    res.redirect("/books");

  } catch (err) {
    res.status(400).send(err.message);
  }
};



// Show single book
export const getBookById = async (req, res) => {
  try {

    const book = await Book
      .findById(req.params.id)
      .populate("category");

    if (!book || book.isDeleted) {
      return res.status(404).send("Book not found");
    }

    res.render("books/show", {
      title: "Book Details",
      book
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
};



// Update book
export const updateBook = async (req, res) => {
  try {

    await Book.findByIdAndUpdate(req.params.id, req.body);

    res.redirect("/books");

  } catch (err) {
    res.status(400).send(err.message);
  }
};



// Soft delete
export const deleteBook = async (req, res) => {
  try {

    await Book.findByIdAndUpdate(req.params.id, {
      isDeleted: true
    });

    res.redirect("/books");

  } catch (err) {
    res.status(400).send(err.message);
  }
};