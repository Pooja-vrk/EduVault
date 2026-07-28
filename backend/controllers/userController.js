const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==========================================
// GET ALL USERS
// ==========================================

const getUsers = async (req, res) => {
  try {

    console.log("========== GET USERS ==========");
    console.log("Logged in user:");
    console.log(req.user);

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    console.log("TOTAL USERS:", users.length);
    console.log(users);

    return res.status(200).json(users);

  } catch (error) {

    console.error("GET USERS ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET LOGGED-IN USER PROFILE
// ==========================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const name = req.body.name?.trim();
    const email = req.body.email
      ?.trim()
      .toLowerCase();

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Check whether another account already uses email
    const emailExists = await User.findOne({
      email,
      _id: {
        $ne: user._id,
      },
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    user.name = name;
    user.email = email;

    const updatedUser = await user.save();

    return res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role || "student",
      profilePic: updatedUser.profilePic || "",
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {
  try {
    const {
      oldPassword,
      newPassword,
    } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Old password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      newPassword,
      salt
    );

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// UPLOAD PROFILE PICTURE
// ==========================================

const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file uploaded",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Save Cloudinary image URL
    user.profilePic = req.file.path;

    await user.save();

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: user.profilePic,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "student",
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error("UPLOAD PROFILE PICTURE ERROR:", error);

    return res.status(500).json({
      message: "Failed to upload profile picture",
    });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getProfile,
  updateProfile,
  uploadProfilePic,
  changePassword,
};