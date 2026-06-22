import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    console.log("═══════════════════════════════════════");
    console.log("REGISTER REQUEST RECEIVED");
    console.log("═══════════════════════════════════════");

    const {
      name,
      email,
      password,
      college,
      year,
      skills,
    } = req.body;

    // Upfront input validation
    if (!name || !email || !password || !college || !year) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      college: college.trim(),
      year,
      skills: Array.isArray(skills) ? skills : [],
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          year: user.year,
          skills: user.skills,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Upfront input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Mitigation for Timing Attacks: Run a dummy bcrypt comparison if the user is not found.
    // This keeps response times relatively uniform and prevents email enumeration.
    if (!user) {
      const dummySalt = await bcrypt.genSalt(10);
      const dummyHash = await bcrypt.hash("dummy_password", dummySalt);
      await bcrypt.compare(password, dummyHash);

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
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
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged in user profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        college: req.user.college,
        year: req.user.year,
        skills: req.user.skills,
        bio: req.user.bio,
        github: req.user.github,
        linkedin: req.user.linkedin,
        avatar: req.user.avatar,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update logged in user profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    console.log("═══════════════════════════════════════");
    console.log("UPDATE PROFILE REQUEST");
    console.log("═══════════════════════════════════════");

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      name,
      email,
      college,
      year,
      skills,
      bio,
      github,
      linkedin,
      avatar,
      password,
    } = req.body;

    // Upgradable fields - apply only if provided (not undefined)
    if (name !== undefined) user.name = name.trim();
    if (college !== undefined) user.college = college.trim();
    if (year !== undefined) user.year = year;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : [];
    if (bio !== undefined) user.bio = bio;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (avatar !== undefined) user.avatar = avatar;

    // Email change - check it isn't already taken by another account
    if (email !== undefined && email !== user.email) {
      const normalizedEmail = email.toLowerCase().trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address",
        });
      }

      const emailTaken = await User.findOne({ email: normalizedEmail });
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
      user.email = normalizedEmail;
    }

    // Password change - validate and hash before saving
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(updatedUser._id),
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        college: updatedUser.college,
        year: updatedUser.year,
        skills: updatedUser.skills,
        bio: updatedUser.bio,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};