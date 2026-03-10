import BookRequest from "../models/bookRequest.js";
import Book from "../models/book.js";
import Transaction from "../models/transactions.js";

// Request a book
export const requestBookService = async (bookId, userId) => {
  const book = await Book.findById(bookId);
  if (!book || book.isDeleted) throw new Error("Book not found");

  const existingRequest = await BookRequest.findOne({
    bookId,
    requestedBy: userId,
    status: { $in: ["pending", "approved"] }
  });
  if (existingRequest) throw new Error("You already requested this book");

  const activeTransaction = await Transaction.findOne({
    bookId,
    issuedTo: userId,
    status: { $in: ["issued", "overdue"] }
  });
  if (activeTransaction) throw new Error("You already have this book issued");

  return BookRequest.create({ bookId, requestedBy: userId });
};

// Get user's requests
export const getUserRequests = (userId) =>
  BookRequest.find({ requestedBy: userId })
    .populate("bookId", "title author")
    .sort({ requestedDate: -1 })
    .lean();

// Get all requests (admin/librarian)
export const getAllRequests = async (filters = {}, { page = 1, limit = 10 } = {}) => {
  const query = {
    ...(filters.status && { status: filters.status }),
    ...(filters.bookId && { bookId: filters.bookId }),
    ...(filters.userId && { requestedBy: filters.userId }),
  };

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
  if (!request || request.status !== "pending") throw new Error("Invalid request");

  const book = request.bookId;
  if (book.totalCopies <= book.issuedCopies) throw new Error("Book not available");

  Object.assign(request, {
    status: "approved",
    approvedBy: approvedById,
    approvedDate: new Date(),
  });
  await request.save();

  return request;
};

// Issue approved request
export const issueApprovedRequestService = async (requestId, issuedById) => {
  const request = await BookRequest.findById(requestId).populate("bookId requestedBy");
  if (!request || request.status !== "approved") throw new Error("Invalid request");

  const book = request.bookId;
  if (book.totalCopies <= book.issuedCopies) throw new Error("Book not available");

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const transaction = await Transaction.create({
    bookId: book._id,
    issuedTo: request.requestedBy._id,
    issuedBy: issuedById,
    dueDate,
  });

  book.issuedCopies += 1;
  await book.save();

  Object.assign(request, {
    status: "issued",
    issuedDate: new Date(),
  });
  await request.save();

  return { transaction, request };
};

// Reject request
export const rejectRequestService = async (requestId, rejectedById) => {
  const request = await BookRequest.findById(requestId);
  if (!request || request.status !== "pending") throw new Error("Invalid request");

  Object.assign(request, {
    status: "rejected",
    approvedBy: rejectedById,
    approvedDate: new Date(),
  });
  await request.save();

  return request;
};
