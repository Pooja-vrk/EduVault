const mongoose = require("mongoose");

/* =========================================
   USER SCHEMA
========================================= */

const userSchema = new mongoose.Schema(
  {
    // =====================================
    // USER NAME
    // =====================================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // =====================================
// STUDENT ID
// =====================================

studentId: {
  type: String,
  unique: true,
  sparse: true,
  trim: true,
},

    // =====================================
    // EMAIL
    // =====================================

    email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
   },

    // =====================================
    // PASSWORD
    // =====================================

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // =====================================
    // USER ROLE
    // =====================================

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // =====================================
    // PROFILE PICTURE
    // =====================================

    profilePic: {
      type: String,
      default: "",
    },
    resetPasswordToken: {
  type: String,
  default: null,
},

resetPasswordExpire: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

/* =========================================
   EXPORT USER MODEL
========================================= */

module.exports = mongoose.model("User", userSchema);