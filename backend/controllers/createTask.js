const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, deadline, status, category, priority, visibility } = req.body;

    if (!title || !description || !deadline || !category || !priority) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newTask = new Task({
      title,
      description,
      deadline,
      status: status || "pending",
      category,
      priority,
      visibility: visibility || "private",
    });

    await newTask.save();
    res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    console.error("Error creating task:", err.message);
    res.status(500).json({ success: false, message: "Error creating task." });
  }
};

module.exports = { createTask };
