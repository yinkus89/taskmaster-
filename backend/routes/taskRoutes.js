const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/Task");
const Category = require("../models/Category");
const isAuthenticated = require("../middleware/authMiddleware");
const ownershipMiddleware = require("../middleware/ownershipMiddleware");

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("categoryId", "name")  // Populating only the 'name' of the category
      .exec();
    
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});


// Task Creation - POST /api/tasks
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, description, deadline, categoryId, priority, visibility } = req.body;

    // Validate categoryId existence in the category collection
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId format" });
    }

    // Use the userId from the authenticated user
    const userId = req.user._id;

    // Create a new task
    const newTask = new Task({
      title,
      description,
      deadline,
      categoryId,
      priority,
      visibility,
      userId,
    });

    const savedTask = await newTask.save();
    res.status(201).json({ task: savedTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// GET /api/tasks/public - Fetch public tasks with optional filters (category, priority, pagination)


// GET /api/tasks/public - Fetch public tasks with optional filters
router.get("/public", async (req, res) => {
  try {
    const { category, priority, page = 1, limit = 10 } = req.query;
    const query = { visibility: "public" };

    if (category) {
      query.categoryId = category;
    }

    if (priority) {
      query.priority = priority;
    }

    const skip = (page - 1) * limit;
    const tasks = await Task.find(query)
      .populate("categoryId", "name") // Populate category only with name
      .skip(skip)
      .limit(parseInt(limit));

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No public tasks available with the given filters." });
    }

    res.status(200).json({
      tasks,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching public tasks:", error);
    res.status(500).json({ message: "Failed to fetch public tasks", error: error.message });
  }
});
// Example of fetching tasks for a specific user (Backend route)
router.get("/tasks", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;  // Get userId from authenticated user
    const tasks = await Task.find({ userId }).populate("categoryId", "name");

    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks available." });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks." });
  }
});



// DELETE Task route
router.delete("/:taskId", isAuthenticated, async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the logged-in user is the one who created the task
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    // If the user is authorized, delete the task
    await task.remove();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// PUT (Update) Task route
router.put("/:taskId", isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Check if the logged-in user is the owner of the task
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this task." });
    }

    // Update task fields
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.deadline = req.body.deadline || task.deadline;
    task.status = req.body.status || task.status;
    task.category = req.body.category || task.category;
    task.priority = req.body.priority || task.priority;
    task.visibility = req.body.visibility || task.visibility;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
