import mongoose from "mongoose";
import {
  createBookService,
  getBookByIdService,
  updateBookService,
  softDeleteBookService,
  getBooksService,
  issueBookService,
  returnBookService,
} from "../services/bookService.js";
import User from '../models/user.js';
import { getCategoryService } from "../services/categoryService.js";

// Get Books (with search + pagination)
export const getBooks = async (req, res) => {
  try {
    const filters = {
      search: req.query.search || "",
      category: req.query.category || "",
    };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { books, total } = await getBooksService(filters, { page, limit });
    const { categories } = await getCategoryService();

    const totalPages = Math.ceil(total / limit) || 1;

    try {
      res.render("books/index", {
        title: "Books",
        books,
        categories,
        search: filters.search,
        selectedCat: filters.category,
        pagination: { page, limit, total, totalPages },
      });
    } catch (renderErr) {
      console.error("Render error:", renderErr);
      res.status(500).send("Error rendering page");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading books");
  }
};

// Show Create Book Form
export const getCreateBookForm = async (req, res) => {
  try {
    const { categories } = await getCategoryService();

    try {
      res.render("books/form", {
        title: "Add Book",
        book: null,
        categories,
      });
    } catch (renderErr) {
      console.error("Render error:", renderErr);
      res.status(500).send("Error rendering form");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading form");
  }
};

// Create Book
export const createBook = async (req, res) => {
  try {
    const { title, author, isbn } = req.body;

    if (!title || !author || !isbn) {
      return res.status(400).send("Title, Author and ISBN are required");
    }

    await createBookService(req.body);

    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
};


// Get Book for Edit Form
export const getBookForEdit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Book ID");
    }

    const book = await getBookByIdService(id);

    if (!book || book.isDeleted) {
      return res.status(404).send("Book not found");
    }

    const { categories } = await getCategoryService();

    try {
      res.render("books/form", {
        title: "Edit Book",
        book,
        categories,
      });
    } catch (renderErr) {
      console.error("Render error:", renderErr);
      res.status(500).send("Error rendering edit form");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading edit form");
  }
};

// Update Book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Book ID");
    }

    const updatedBook = await updateBookService(id, req.body);

    if (!updatedBook) {
      return res.status(404).send("Book not found");
    }

    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
};

// Soft Delete Book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Book ID");
    }

    const deletedBook = await softDeleteBookService(id);

    if (!deletedBook) {
      return res.status(404).send("Book not found");
    }

    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
};

//isssue book
export const issueBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { borrower, issueDate } = req.body;
    const issuedById = req.user._id; 

    
    const user = await User.findOne({ 
      $or: [{ uname: borrower }, { email: borrower }] 
    });

    if (!user) {
      return res.status(400).send("Borrower not found in user database");
    }

    
    const transaction = await issueBookService(bookId, user._id, issuedById);

    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error issuing book");
  }
};

// Return Book
export const returnBook = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).send("Invalid Transaction ID");
    }

    const transaction = await returnBookService(transactionId, req.user._id);

    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
};
