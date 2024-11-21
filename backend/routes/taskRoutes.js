const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const isAuthenticated = require("../middleware/authMiddleware");
const ownershipMiddleware = require("../middleware/ownershipMiddleware");

// Create a new task
router.post("/create", async (req, res) => {
  try {
    const { title, description, deadline, category, priority, visibility } =
      req.body;

    if (!title || !description || !deadline || !category || !priority) {
      console.log(title,description,deadline,catgory,priority);
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const newTask = new Task({
      title: req.body.title || "test",
      description: req.body.description || "test",
      deadline: req.body.deadline || new Date(1999,3,3),
      status: req.body.status || "pending", // Default status if not provided
      category: req.body.category || "test",
      priority: req.body.priority || "test",
      visibility: req.body.visibility || "private", // Default visibility
      userId: req.user._id || "test", // Assuming the task is tied to the authenticated user
    });

    // Save the task to the database
    await newTask.save();

    res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    console.error("Error creating task:", err.message);
    res.status(500).json({ success: false, message: "Error creating task." });
  }
});
// Get all tasks (Admin-only access)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const tasks = await Task.find();
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({ success: false, message: "Error fetching tasks." });
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch tasks using the model
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({ success: false, message: "Error fetching tasks." });
  }
});

module.exports = router;

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
      return res
        .status(404)
        .json({ message: "No public tasks available with the given filters." });
    }

    res.status(200).json({
      tasks,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching public tasks:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch public tasks", error: error.message });
  }
});

// Example of fetching tasks for a specific user (Backend route)
router.get("/tasks", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Get userId from authenticated user
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
router.delete(
  "/:taskId",
  isAuthenticated,
  ownershipMiddleware,
  async (req, res) => {
    const { taskId } = req.params;

    try {
      const task = await Task.findById(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // If ownershipMiddleware is working, the task owner is already verified by req.user
      if (task.userId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this task" });
      }

      // If the user is authorized, delete the task
      await task.remove();
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT (Update) Task route
router.put(
  "/:taskId",
  isAuthenticated,
  ownershipMiddleware,
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }

      // Ownership is validated in ownershipMiddleware, so no need to check here
      if (task.userId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this task." });
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
  }
);

module.exports = router;
