import Book from "../models/book.js";

export const getBooksService = async (filters) => {
  let query = { isDeleted: false };

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { author: { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters.category) {
    query.category = filters.category;
  }

  return await Book.find(query).populate("category");
};

export const getAllBooks = async () => {
  return await Book.find({ isDeleted: false }).populate("category");
};

export const createBookService = async (bookData) => {
  return await Book.create(bookData);
};

export const getBookByIdService = async (id) => {
  return await Book.findById(id).populate("category");
};

export const updateBookService = async (id, updateData) => {
  return await Book.findByIdAndUpdate(id, updateData, { new: true });
};

export const softDeleteBookService = async (id) => {
  return await Book.findByIdAndUpdate(id, { isDeleted: true });
};
