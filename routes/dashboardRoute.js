import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    user: req.user
  });
});

export default router;