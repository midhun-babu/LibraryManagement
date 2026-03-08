import express from "express";
import {
  getBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);
router.post("/", createBook);
router.get("/:id", getBookById);
router.post("/:id/update", updateBook);
router.post("/:id/delete", deleteBook);

export default router;