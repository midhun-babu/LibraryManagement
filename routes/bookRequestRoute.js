import express from "express";
import {
  requestBook,
  getUserBookRequests,
  getAllBookRequests,
  approveRequest,
  issueApprovedRequest,
  rejectRequest,
} from "../controllers/bookRequestController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Request a book
router.post("/:id/request", protect, requestBook);

// User requests
router.get("/my", protect, getUserBookRequests);

// Admin/Librarian requests
router.get("/", protect, authorizeRoles("admin", "librarian"), getAllBookRequests);
router.post("/:id/approve", protect, authorizeRoles("admin", "librarian"), approveRequest);
router.post("/:id/issue", protect, authorizeRoles("admin", "librarian"), issueApprovedRequest);
router.post("/:id/reject", protect, authorizeRoles("admin", "librarian"), rejectRequest);

export default router;