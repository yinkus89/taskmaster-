// taskRoutes.js
const express = require("express");
const protect = require("./authMiddleware"); // Adjust path if necessary
const Task = require("../models/Task");

const router = express.Router();

// POST /tasks - Create a new task (Protected Route)
router.post("/tasks", protect, async (req, res) => {
  try {
    const { title, description, deadline, category, priority } = req.body;

    // Create a new Task document
    const newTask = new Task({
      title,
      description,
      deadline,
      category,
      priority,
      user: req.user.id, // Attach user ID from the token payload (req.user)
    });

    // Save the new task in the database
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
