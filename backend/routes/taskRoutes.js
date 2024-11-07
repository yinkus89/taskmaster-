const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');

// Use cookie-parser middleware for cookie handling
router.use(cookieParser());

// Middleware to check authentication
const protect = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Get tasks
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create task
router.post('/', protect, async (req, res) => {
    const { title, description, category, priority, deadline } = req.body;

    // Input validation
    if (!title || !description || !category || !priority || !deadline) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate deadline (Make sure it's a valid date)
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate)) {
        return res.status(400).json({ message: 'Invalid deadline format' });
    }

    try {
        const newTask = new Task({
            title,
            description,
            category,
            priority,
            dueDate: deadlineDate, // Convert deadline to Date object
            userId: req.user.id
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
