const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const isAuthenticated = require("../middlewares/authMiddleware");
const ownershipMiddleware = require("../middlewares/ownershipMiddleware");
const { getTasks } = require("../controllers/taskController");

// Create a new task
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, description, category, priority, deadline } = req.body;

    // Validate required fields
    if (!title || !description || !category || !priority || !deadline) {
      return res.status(400).json({ success: false, message: "All fields must be filled out." });
    }

    // Create a new task with the userId from the authenticated user
    const newTask = new Task({
      title,
      description,
      category,
      priority,
      deadline,
      userId: req.user.id, // Attach the authenticated user's ID to the task
    });

    await newTask.save();
    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Error creating task." });
  }
});

// Correct the route to /api/tasks and use the controller method
router.get("/", isAuthenticated, getTasks); // Changed /tasks to /

module.exports = router;
