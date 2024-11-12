const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const protect = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

// Create a new task
router.post('/', protect, async (req, res) => {
    const { title, description, category, priority, deadline } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            category,
            priority,
            dueDate: new Date(deadline),
            userId: req.user.id, // Attach user ID from the token
        });

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ message: 'Failed to create task', error: err.message });
    }
});

// Get all tasks for the authenticated user
router.get('/', protect, async (req, res) => {
    try {
        // Filter tasks by the logged-in user's ID
        const tasks = await Task.find({ userId: req.user.id });
        res.status(200).json(tasks);
    } catch (err) {
        console.error("Error retrieving tasks:", err);
        res.status(500).json({ message: 'Failed to retrieve tasks', error: err.message });
    }
});

// Get a single task by ID
router.get('/:taskId', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task || task.userId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        console.error("Error retrieving task:", err);
        res.status(500).json({ message: 'Failed to retrieve task', error: err.message });
    }
});

// Update a task by ID
router.put('/:taskId', protect, async (req, res) => {
    const { title, description, category, priority, deadline } = req.body;

    try {
        const task = await Task.findById(req.params.taskId);
        if (!task || task.userId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update task fields if they are provided
        task.title = title || task.title;
        task.description = description || task.description;
        task.category = category || task.category;
        task.priority = priority || task.priority;
        task.dueDate = deadline ? new Date(deadline) : task.dueDate;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ message: 'Failed to update task', error: err.message });
    }
});

// Delete a task by ID
router.delete('/:taskId', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task || task.userId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.remove();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ message: 'Failed to delete task', error: err.message });
    }
});

module.exports = router;
