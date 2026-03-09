import {
  createBookService,
  getBookByIdService,
  updateBookService,
  softDeleteBookService,
  getBooksService
} from "../services/bookService.js";
import { getCategoryService } from "../services/categoryService.js";

//Books through search
export const getBooks = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category
    };

    const books = await getBooksService(filters);
    const categories = await getCategoryService();

    res.render("books/index", { 
      title: "Books", 
      books, 
      categories,
      search: filters.search,
      selectedCat: filters.category
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//Add Book
export const createBook = async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).send("Title and Author required");
    }
    await createBookService(req.body);
    res.redirect("/books");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

//searchBookById
export const getBookById = async (req, res) => {
  try {
    const book = await getBookByIdService(req.params.id);
    if (!book || book.isDeleted) {
      return res.status(404).send("Book not found");
    }
    res.render("books/show", { title: "Book Details", book });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//update book
export const updateBook = async (req, res) => {
  try {
    await updateBookService(req.params.id, req.body);
    res.redirect("/books");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

//delete book
export const deleteBook = async (req, res) => {
  try {
    await softDeleteBookService(req.params.id);
    res.redirect("/books");
  } catch (err) {
    res.status(400).send(err.message);
  }
};
