const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    let { name, studentId, password } = req.body;

    name = name?.trim();
    studentId = studentId?.trim().toUpperCase();

    if (!name || !studentId || !password) {
    return res.status(400).json({
        message: "Please provide Name, Student ID and Password",
    });
}
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const userExists = await User.findOne({
    studentId,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    const user = await User.create({
    name,
    studentId,
    password: hashedPassword,
    role: "student",
    profilePic: "",
});

    return res.status(201).json({
      message: "Registration Successful",

      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        role: user.role || "student",
        profilePic: user.profilePic || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {
  try {
    let { email, studentId, password } = req.body;

let user = null;

// ===============================
// STUDENT LOGIN
// ===============================

if (studentId) {

  studentId = studentId.trim().toUpperCase();

  user = await User.findOne({
    studentId,
  });

}

// ===============================
// ADMIN LOGIN
// ===============================

else if (email) {

  email = email.trim().toLowerCase();

  user = await User.findOne({
    email,
  });

}

// ===============================
// VALIDATION
// ===============================

if (!user || !password) {

  return res.status(400).json({
    message: "Invalid credentials",
  });

}

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const userRole = user.role || "student";

    return res.status(200).json({
      message: "Login Successful",

      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,

        // IMPORTANT FOR NAVBAR
        profilePic: user.profilePic || "",

        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};