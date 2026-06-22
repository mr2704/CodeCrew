import Swipe from "../models/Swipe.js";
import Match from "../models/Match.js";

// POST /api/swipes
export const createSwipe = async (req, res) => {
  try {
    const { targetUserId, action } = req.body;

    const swiperId = req.user._id;

    // Prevent self swipe
    if (swiperId.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot swipe on yourself",
      });
    }

    // Save swipe
    const swipe = await Swipe.create({
      swiper: swiperId,
      target: targetUserId,
      action,
    });

    let isMatch = false;

    // Check for mutual like
    if (action === "like") {
      const oppositeSwipe = await Swipe.findOne({
        swiper: targetUserId,
        target: swiperId,
        action: "like",
      });

      if (oppositeSwipe) {
        isMatch = true;

        // Prevent duplicate matches
        const existingMatch = await Match.findOne({
          users: { $all: [swiperId, targetUserId] },
        });

        if (!existingMatch) {
          await Match.create({
            users: [swiperId, targetUserId],
          });
        }
      }
    }

    return res.status(201).json({
      success: true,
      swipe,
      isMatch,
      message: isMatch
        ? "🎉 It's a Match!"
        : "Swipe recorded successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/swipes/matches
export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.user._id,
    }).populate("users", "-password");

    return res.status(200).json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};