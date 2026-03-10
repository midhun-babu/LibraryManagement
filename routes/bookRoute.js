import express from "express";
import {
  getBooks,
  getCreateBookForm,
  createBook,
  getBookForEdit,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
} from "../controllers/bookController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all books
router.get("/", getBooks);

// Add Book Form and Create Book
router.get("/form", protect, authorizeRoles("librarian", "admin"), getCreateBookForm);
router.post("/", protect, authorizeRoles("librarian", "admin"), createBook);

// Edit Book Form and Update Book
router.get("/:id/form",  protect,  authorizeRoles("librarian", "admin"),  getBookForEdit,);
router.post(  "/:id/update",  protect,  authorizeRoles("librarian", "admin"),  updateBook,);

// Delete Book
router.post( "/:id/delete",  protect,  authorizeRoles("librarian", "admin"),  deleteBook,);

// Issue and Return routes
router.post('/:id/issue', protect, authorizeRoles("admin","librarian"), issueBook);
router.post("/return/:transactionId", protect, authorizeRoles("librarian", "admin"), returnBook);



export default router;
