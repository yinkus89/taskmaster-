const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, category, visibility, deadline } = req.body;
    const userId = req.user._id; // Assuming you have user info from middleware

    if (!title || !description || !category || !priority) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newTask = new Task({
      title,
      description,
      priority,
      status,
      category,
      visibility,
      deadline,
      userId, // Attach user ID to the task
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      task: newTask,
    });
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error creating task.',
      error: err.message,
    });
  }
};

module.exports = { createTask };
