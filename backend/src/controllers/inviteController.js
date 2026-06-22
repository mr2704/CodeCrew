import Invite from "../models/Invite.js";

export const sendInvite = async (req, res) => {
  try {
    const { receiverId, projectName, message } = req.body;

    const invite = await Invite.create({
      sender: req.user._id,
      receiver: receiverId,
      projectName,
      message,
    });

    res.status(201).json({
      success: true,
      invite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getIncomingInvites = async (req, res) => {
  try {
    const invites = await Invite.find({
      receiver: req.user._id,
    })
      .populate("sender", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      invites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSentInvites = async (req, res) => {
  try {
    const invites = await Invite.find({
      sender: req.user._id,
    })
      .populate("receiver", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      invites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const respondToInvite = async (req, res) => {
  try {
    const { status } = req.body;

    const invite = await Invite.findById(req.params.id);

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "Invite not found",
      });
    }

    invite.status = status;

    await invite.save();

    res.json({
      success: true,
      invite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};