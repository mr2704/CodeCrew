import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Profile Routes
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;