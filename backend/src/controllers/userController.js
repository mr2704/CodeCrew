import User from "../models/User.js";

/**
 * @route   GET /api/users
 * @desc    Get all registered student developers (public profile fields only)
 * @access  Public
 */
export const getUsers = async (req, res) => {
  try {
    // Optimization: Exclude password and private email addresses from public list.
    // Projection ensures we only fetch and serialize fields required by the frontend card catalog.
    const users = await User.find()
      .select("name college year skills bio github linkedin avatar")
      .lean(); // Lean query for faster JSON serialization and lower memory footprint

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name || "",
      college: user.college || "",
      year: user.year || "",
      skills: Array.isArray(user.skills) ? user.skills : [],
      bio: user.bio || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      avatar: user.avatar || "",
    }));

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};