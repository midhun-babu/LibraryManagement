import Book from "../model/book.js";

// Create

export const createBook = async (req, res) => {
  try {

    const { title, author } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        error: "Title and Author are required"
      });
    }

    const book = await Book.create(req.body);

    res.status(201).json({
      message: "Book created",
      book
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Read 
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ isDeleted: false }).populate("category");
    res.json({ books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read 
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("category");
    if (!book || book.isDeleted) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Book updated", book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete 
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.json({ message: "Book deleted", book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// searchBooks 
export const searchBooks = async (req, res) => {
  try {
    const { title } = req.query;

    const books = await Book.find({
      title: { $regex: title, $options: "i" },
      isDeleted: false
    }).populate("category");

    res.json({ books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//catgory filter
export const getBooksByCategory = async (req, res) => {
  try {
    const books = await Book.find({
      category: req.params.categoryId,
      isDeleted: false
    }).populate("category");

    res.json({ books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//is deleted to false

export const restoreBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );

    res.json({ message: "Book restored", book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// permanent delete 

export const permanentDeleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book permanently deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// validation
