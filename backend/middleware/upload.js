const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "EduVault/materials",
    resource_type: "raw",
    allowed_formats: [
      "pdf",
      "doc",
      "docx",
      "ppt",
      "pptx",
    ],
  },
});

module.exports = multer({
  storage,
});