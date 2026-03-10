import {
  getUserTransactions as getUserTransactionsService,
  getAllTransactions as getAllTransactionsService,
  getTransactionById as getTransactionByIdService,
  calculateUserFines as calculateUserFinesService,
} from "../services/transactionService.js";

// Get user's transactions
export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await getUserTransactionsService(req.user._id);
    const totalFine = await calculateUserFinesService(req.user._id);

    try {
      res.render("transactions/my", {
        title: "My Transactions",
        transactions,
        totalFine,
      });
    } catch (renderErr) {
      console.error("Render error:", renderErr);
      res.status(500).send("Error rendering transactions");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading transactions");
  }
};

// Get all transactions (admin)
export const getAllTransactions = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      userId: req.query.userId,
      bookId: req.query.bookId,
    };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { transactions, total } = await getAllTransactionsService(filters, { page, limit });
    const totalPages = Math.ceil(total / limit) || 1;

    try {
      res.render("transactions/index", {
        title: "All Transactions",
        transactions,
        pagination: { page, limit, total, totalPages },
        filters,
      });
    } catch (renderErr) {
      console.error("Render error:", renderErr);
      res.status(500).send("Error rendering transactions");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading transactions");
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await getTransactionByIdService(req.params.id);
    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    try {
      res.render("transactions/show", {
        title: "Transaction Details",
        transaction,
      });
    } catch (renderErr) {
      console.error("Render error:", renderErr);
      res.status(500).send("Error rendering transaction");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading transaction");
  }
};