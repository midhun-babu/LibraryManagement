import express from "express";
import {
  getUserTransactions,
  getAllTransactions,
  getTransactionById,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User transactions
router.get("/my", protect, getUserTransactions);

// Admin transactions
router.get("/", protect, authorizeRoles("admin", "librarian"), getAllTransactions);
router.get("/:id", protect, authorizeRoles("admin", "librarian"), getTransactionById);

export default router;