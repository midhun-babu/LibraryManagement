import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { dashboardController } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", protect, dashboardController);

export default router;