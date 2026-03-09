import express from "express";
import { getBooks, createBook, getBookById, updateBook, deleteBook } from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);


router.get("/", protect, authorizeRoles("librarian", "admin"), createBook);
router.get("/:id/update", protect, authorizeRoles("librarian", "admin"), updateBook);
router.post("/:id/delete", protect, authorizeRoles("librarian", "admin"), deleteBook);

export default router;