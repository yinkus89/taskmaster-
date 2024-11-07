// Import express
const express = require('express');
const router = express.Router(); // Create a router instance

// Import the protect middleware and Task model
const protect = require('../middleware/authMiddleware'); // Assuming you have a middleware for authentication
const Task = require('../models/Task');

// POST route to create a task
router.post('/tasks', protect, async (req, res) => {
    const { title, description, category, priority, dueDate, status } = req.body;

    if (!title || !description || !category || !priority || !dueDate || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newTask = new Task({
            title,
            description,
            category,
            priority,
            dueDate: new Date(dueDate),
            status,
            userId: req.user.id,
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; // Make sure to export the router
