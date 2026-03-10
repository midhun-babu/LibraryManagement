import BookRequest from "../models/bookRequest.js";
import Book from "../models/book.js";

// Request a book
export const requestBookService = async (bookId, userId) => {
  // Check if book exists and is available
  const book = await Book.findById(bookId);
  if (!book || book.isDeleted) throw new Error("Book not found");

  // Check if user already has a pending request for this book
  const existingRequest = await BookRequest.findOne({
    bookId,
    requestedBy: userId,
    status: { $in: ["pending", "approved"] }
  });
  if (existingRequest) throw new Error("You already have a pending request for this book");

  // Check if user already has this book issued
  const Transaction = (await import("../models/transactions.js")).default;
  const activeTransaction = await Transaction.findOne({
    bookId,
    issuedTo: userId,
    status: { $in: ["issued", "overdue"] }
  });
  if (activeTransaction) throw new Error("You already have this book issued");

  const request = await BookRequest.create({
    bookId,
    requestedBy: userId
  });

  return request;
};

// Get user's requests
export const getUserRequests = async (userId) => {
  return await BookRequest.find({ requestedBy: userId })
    .populate("bookId", "title author")
    .sort({ requestedDate: -1 })
    .lean();
};

// Get all requests (for admin/librarian)
export const getAllRequests = async (filters = {}, options = {}) => {
  const { page = 1, limit = 10 } = options;
  let query = {};

  if (filters.status) query.status = filters.status;
  if (filters.bookId) query.bookId = filters.bookId;
  if (filters.userId) query.requestedBy = filters.userId;

  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    BookRequest.find(query)
      .populate("bookId", "title author availabilityStatus")
      .populate("requestedBy", "name uname email")
      .populate("approvedBy", "name")
      .sort({ requestedDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BookRequest.countDocuments(query),
  ]);

  return { requests, total };
};

// Approve request
export const approveRequestService = async (requestId, approvedById) => {
  const request = await BookRequest.findById(requestId).populate("bookId");
  if (!request) throw new Error("Request not found");
  if (request.status !== "pending") throw new Error("Request is not pending");

  const book = request.bookId;
  if (book.totalCopies - book.issuedCopies <= 0) throw new Error("Book is not available");

  request.status = "approved";
  request.approvedBy = approvedById;
  request.approvedDate = new Date();
  await request.save();

  return request;
};

// Issue approved request
export const issueApprovedRequestService = async (requestId, issuedById) => {
  const request = await BookRequest.findById(requestId).populate("bookId requestedBy");
  if (!request) throw new Error("Request not found");
  if (request.status !== "approved") throw new Error("Request is not approved");

  const book = request.bookId;
  if (book.totalCopies - book.issuedCopies <= 0) throw new Error("Book is not available");

  // Issue the book
  const Transaction = (await import("../models/transactions.js")).default;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const transaction = await Transaction.create({
    bookId: book._id,
    issuedTo: request.requestedBy._id,
    issuedBy: issuedById,
    dueDate,
  });

  // Update book
  book.issuedCopies += 1;
  await book.save();

  // Update request
  request.status = "issued";
  request.issuedDate = new Date();
  await request.save();

  return { transaction, request };
};

// Reject request
export const rejectRequestService = async (requestId, rejectedById) => {
  const request = await BookRequest.findById(requestId);
  if (!request) throw new Error("Request not found");
  if (request.status !== "pending") throw new Error("Request is not pending");

  request.status = "rejected";
  request.approvedBy = rejectedById;
  request.approvedDate = new Date();
  await request.save();

  return request;
};