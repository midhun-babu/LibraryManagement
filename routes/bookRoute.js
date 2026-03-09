import express from "express";
import {
  getBooks,
  getCreateBookForm,
  createBook,
  getBookById,
  getBookForEdit,
  updateBook,
  deleteBook,
  issueBook,
  issueSelf,
  returnBook,
} from "../controllers/bookController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all books
router.get("/", getBooks);

// Add Book Form
router.get("/form", protect, authorizeRoles("librarian", "admin"), getCreateBookForm);

// Create Book
router.post("/", protect, authorizeRoles("librarian", "admin"), createBook);

// Edit Book Form
router.get(
  "/:id/form",
  protect,
  authorizeRoles("librarian", "admin"),
  getBookForEdit,
);

// Update Book
router.post(
  "/:id/update",
  protect,
  authorizeRoles("librarian", "admin"),
  updateBook,
);

// Delete Book
router.post(
  "/:id/delete",
  protect,
  authorizeRoles("librarian", "admin"),
  deleteBook,
);

// Issue and Return routes
router.post("/:id/issue", protect, authorizeRoles("librarian", "admin"), issueBook);
router.post("/:id/issue-self", protect, authorizeRoles("librarian", "admin"), issueSelf);
router.post("/return/:transactionId", protect, authorizeRoles("librarian", "admin"), returnBook);

// Get Book By ID (keep LAST)
router.get("/:id", getBookById);

export default router;
