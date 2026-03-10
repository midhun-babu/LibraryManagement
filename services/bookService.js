import Book from "../models/book.js";
import Transaction from "../models/transactions.js";

// Get books with search, category filter, and pagination
export const getBooksService = async (filters = {}, options = {}) => {
  const { page = 1, limit = 10 } = options;

  let query = { isDeleted: false };

  // Search filter (title or author)
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { author: { $regex: filters.search, $options: "i" } },
    ];
  }

  // Category filter
  if (filters.category) {
    query.category = filters.category;
  }

  const skip = (page - 1) * limit;

  const [books, total] = await Promise.all([
    Book.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Book.countDocuments(query),
  ]);

  return { books, total };
};

// Get all books (without pagination)
export const getAllBooks = async () => {
  return await Book.find({ isDeleted: false })
    .populate("category")
    .sort({ createdAt: -1 });
};

// Create new book
export const createBookService = async (bookData) => {
  const isbn = bookData.isbn.trim();

  const existingBook = await Book.findOne({ isbn });
  if (existingBook && existingBook.isDeleted) {
    existingBook.isDeleted = false;

    existingBook.totalCopies = bookData.totalCopies;
    existingBook.availableCopies = bookData.availableCopies;

    await existingBook.save();

    return {
      message: "Book restored from deleted records",
      book: existingBook,
    };
  }
  if (existingBook && !existingBook.isDeleted) {
    throw new Error("Book already exists. Please update it instead.");
  }
  const book = new Book({
    ...bookData,
    isbn,
  });

  await book.save();

  return {
    message: "Book created successfully",
    book,
  };
};

// Get book by ID
export const getBookByIdService = async (id) => {
  return await Book.findOne({
    _id: id,
    isDeleted: false,
  }).populate("category");
};

// Update book
export const updateBookService = async (id, updateData) => {
  const book = await Book.findOne({ _id: id, isDeleted: false });

  if (!book) {
    throw new Error("Book not found");
  }
  if (updateData.totalCopies !== undefined) {
    const difference = updateData.totalCopies - book.totalCopies;

    const newAvailable = book.availableCopies + difference;

    if (updateData.totalCopies < 0 || newAvailable < 0) {
      throw new Error("Total copies or available copies cannot be negative");
    }

    updateData.availableCopies = newAvailable;
  }
  if (
    updateData.availableCopies !== undefined &&
    updateData.availableCopies < 0
  ) {
    throw new Error("Available copies cannot be negative");
  }

  return await Book.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );
};

// Soft delete book
export const softDeleteBookService = async (id) => {
  const book = await Book.findOne({ _id: id, isDeleted: false });

  if (!book) {
    throw new Error("Book not found");
  }

  if (book.availableCopies !== book.totalCopies) {
    throw new Error("Book cannot be deleted. Some copies are issued.");
  }

  book.isDeleted = true;

  return await book.save();
};
// Issue book to user
export const issueBookService = async (bookId, userId, issuedById) => {
  const book = await Book.findById(bookId);
  if (!book || book.isDeleted) throw new Error("Book not found");
  if (book.availableCopies <= 0) throw new Error("Book not available");

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const transaction = await Transaction.create({
    bookId,
    issuedTo: userId,
    issuedBy: issuedById,
    dueDate,
  });

  book.issuedCopies += 1;
  book.availableCopies -= 1;
  await book.save();

  return transaction;
};
// Return book
export const returnBookService = async (transactionId) => {
  const transaction =
    await Transaction.findById(transactionId).populate("bookId");
  if (!transaction) throw new Error("Transaction not found");
  if (transaction.returnDate) throw new Error("Book already returned");

  const returnDate = new Date();
  let fine = 0;

  if (returnDate > transaction.dueDate) {
    const daysOverdue = Math.ceil(
      (returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24),
    );
    fine = daysOverdue * 1;
  }

  transaction.returnDate = returnDate;
  transaction.fine = fine;
  transaction.status = "returned";
  await transaction.save();

  // Update book issued copies
  const book = transaction.bookId;
  book.issuedCopies -= 1;
  await book.save();

  return transaction;
};
