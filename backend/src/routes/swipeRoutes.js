import express from "express";
import { createSwipe, getMatches } from "../controllers/swipeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a swipe (like/pass)
router.post("/", protect, createSwipe);

// Get all matches of logged-in user
router.get("/matches", protect, getMatches);

export default router;