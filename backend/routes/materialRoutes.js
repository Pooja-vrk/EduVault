const express = require("express");

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


// Upload
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("file"),
  uploadMaterial
);


// View all materials
router.get("/all", getMaterials);


// Update
router.put(
  "/:id",
  protect,
  adminOnly,
  updateMaterial
);


// Delete
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteMaterial
);

module.exports = router;