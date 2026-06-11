import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      year: user.year,
      skills: user.skills,
      bio: user.bio,
      github: user.github,
      linkedin: user.linkedin,
      avatar: user.avatar,
    }));

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};