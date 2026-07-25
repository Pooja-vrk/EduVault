const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: String,
      default: "Student",
    },

    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Material",
  materialSchema
);