import Transaction from "../models/transactions.js";

// Get transactions for a user
export const getUserTransactions = async (userId) => {
  return await Transaction.find({ issuedTo: userId })
    .populate("bookId", "title author")
    .populate("issuedBy", "name")
    .sort({ issuedDate: -1 })
    .lean();
};

// Get all transactions (for admin)
export const getAllTransactions = async (filters = {}, options = {}) => {
  const { page = 1, limit = 10 } = options;
  let query = {};

  if (filters.status) query.status = filters.status;
  if (filters.userId) query.issuedTo = filters.userId;
  if (filters.bookId) query.bookId = filters.bookId;

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate("bookId", "title author")
      .populate("issuedTo", "name uname")
      .populate("issuedBy", "name")
      .sort({ issuedDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(query),
  ]);

  return { transactions, total };
};

// Get transaction by ID
export const getTransactionById = async (id) => {
  return await Transaction.findById(id)
    .populate("bookId", "title author")
    .populate("issuedTo", "name uname")
    .populate("issuedBy", "name")
    .lean();
};

// Calculate user fines
export const calculateUserFines = async (userId) => {
  const transactions = await Transaction.find({
    issuedTo: userId,
    status: { $in: ["issued", "overdue"] },
  }).lean();

  let totalFine = 0;
  const now = new Date();

  transactions.forEach((transaction) => {
    if (now > transaction.dueDate) {
      const daysOverdue = Math.ceil((now - transaction.dueDate) / (1000 * 60 * 60 * 24));
      totalFine += daysOverdue * 1; // 1 rupee per day
    }
  });

  return totalFine;
};

// Update overdue status
export const updateOverdueTransactions = async () => {
  const now = new Date();
  await Transaction.updateMany(
    { dueDate: { $lt: now }, status: "issued" },
    { status: "overdue" }
  );
};