import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id } // exclude logged-in user
    }).select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};