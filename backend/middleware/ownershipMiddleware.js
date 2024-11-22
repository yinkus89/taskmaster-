const mongoose = require("mongoose");
const Task = require('../models/Task');

const ownershipMiddleware = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Check if the authenticated user owns the task
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this task." });
    }

    // If ownership validated, proceed
    next();
  } catch (err) {
    console.error("Error in ownershipMiddleware:", err);
    res.status(500).json({ message: "Server error while checking ownership." });
  }
};

module.exports = ownershipMiddleware;