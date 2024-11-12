const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const isAuthenticated = require('../middlewares/authMiddleware'); // Import the auth middleware
const ownershipMiddleware = require('../middlewares/ownershipMiddleware');

// Create a new task - Requires authentication
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const task = new Task({
      name,
      description,
      user: req.user.id, // Associate task with the authenticated user
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve all tasks for the authenticated user
router.get('/', isAuthenticated, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const tasks = await Task.find({ user: req.user.id })
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await Task.countDocuments({ user: req.user.id });

        res.status(200).json({
            tasks,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a task - Requires authentication
router.put('/:id', ownershipMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id }); // Ensure task belongs to authenticated user
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { name, description } = req.body;
    task.name = name || task.name;
    task.description = description || task.description;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a task - Requires authentication
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // Ensure task belongs to authenticated user
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
