import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  sendInvite,
  getIncomingInvites,
  getSentInvites,
  respondToInvite,
} from "../controllers/inviteController.js";

const router = express.Router();

router.post("/", protect, sendInvite);

router.get("/incoming", protect, getIncomingInvites);

router.get("/sent", protect, getSentInvites);

router.put("/:id", protect, respondToInvite);

export default router;