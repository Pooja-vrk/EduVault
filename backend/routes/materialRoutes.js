const express = require("express");
const path = require("path");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const {
  uploadMaterial,
  getMaterials,
  deleteMaterial,
  updateMaterial,
} = require("../controllers/materialController");

// ADMIN ONLY: Upload
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("file"),
  uploadMaterial
);

// EVERYONE: View materials
router.get("/all", getMaterials);

// ADMIN ONLY: Delete
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteMaterial
);

// ADMIN ONLY: Update
router.put(
  "/:id",
  protect,
  adminOnly,
  updateMaterial
);

// Download
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../uploads",
    req.params.filename
  );

  res.download(filePath);
});

module.exports = router;