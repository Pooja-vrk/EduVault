const express = require("express");

const router = express.Router();

const {
  addFeedback,
  getFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

// Add Feedback
router.post("/", addFeedback);

// Get All Feedback
router.get("/", getFeedback);

// Delete Feedback
router.delete("/:id", deleteFeedback);

module.exports = router;