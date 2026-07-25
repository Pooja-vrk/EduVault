const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables FIRST
dotenv.config();

// Database
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const materialRoutes = require("./routes/materialRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require(
  "./routes/notificationRoutes"
);

// Connect MongoDB
connectDB();

const app = express();

/* =========================================
   CORS
========================================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* =========================================
   BODY MIDDLEWARE
========================================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================
   STATIC UPLOAD FOLDER

   Example:
   Database:
   uploads/12345-file.pdf

   Browser:
   http://localhost:5000/uploads/12345-file.pdf
========================================= */

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/* =========================================
   API ROUTES
========================================= */

app.use("/api/auth", authRoutes);

app.use(
  "/api/materials",
  materialRoutes
);

app.use(
  "/api/feedback",
  feedbackRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

/* =========================================
   DEFAULT ROUTE
========================================= */

app.get("/", (req, res) => {
  res.send(
    "EduVault Backend Running 🚀"
  );
});

/* =========================================
   404 API ROUTE
========================================= */

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================
   GLOBAL ERROR HANDLER
========================================= */

app.use(
  (err, req, res, next) => {
    console.error(
      "Server Error:",
      err
    );

    res.status(
      err.status || 500
    ).json({
      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

/* =========================================
   START SERVER
========================================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running at http://localhost:${PORT}`
  );

  console.log(
    `📁 Uploads available at http://localhost:${PORT}/uploads`
  );
});