const express = require("express");

const router = express.Router();

const {
  getUsers,
  deleteUser,
  getProfile,
  updateProfile,
  uploadProfilePic,
  changePassword,
} = require("../controllers/userController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// ==========================
// ADMIN ROUTES
// ==========================

router.get(
  "/",
  protect,
  adminOnly,
  getUsers
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

// ==========================
// PROFILE ROUTES
// ==========================

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.put(
  "/change-password",
  protect,
  changePassword
);

router.post(
  "/profile/upload",
  protect,
  upload.single("profilePic"),
  uploadProfilePic
);

module.exports = router;