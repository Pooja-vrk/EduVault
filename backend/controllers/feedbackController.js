const Feedback = require("../models/Feedback");

// ==============================
// Add Feedback
// ==============================
const addFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const feedback = await Feedback.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      message: "Feedback Sent Successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get All Feedback
// ==============================
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({
      createdAt: -1,
    });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Delete Feedback
// ==============================
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    await feedback.deleteOne();

    res.json({
      message: "Feedback Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addFeedback,
  getFeedback,
  deleteFeedback,
};