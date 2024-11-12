const express = require("express");
const protect = require("./authMiddleware"); // Assuming your file is located in middleware/authMiddleware.js
const Task = require("../models/Task");

const router = express.Router();

// Example of a protected route
router.post("/tasks", protect, async (req, res) => {
  try {
    const { title, description, deadline, category, priority } = req.body;

    const newTask = new Task({
      title,
      description,
      deadline,
      category,
      priority,
      user: req.user._id, // Attach user ID from the token
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
