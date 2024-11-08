const express = require('express');
const Task = require('../models/Task');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');
const User = require('../models/User'); // Make sure the User model is imported

// Use cookie-parser middleware for cookie handling
router.use(cookieParser());

// Middleware to check authentication
const protect = async (req, res, next) => {
    let token;
    if (req.cookies.token) {
        token = req.cookies.token; // Cookie with the token
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Create a new task
router.post('/', protect, async (req, res) => {
    const { title, description, category, priority, deadline } = req.body;

    console.log('Received Task Data:', req.body);

    // Input validation
    if (!title || !description || !category || !priority || !deadline) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate category: Ensure the category exists in the Category collection
    const validCategory = await Category.findById(category);
    if (!validCategory) {
        return res.status(400).json({ message: 'Invalid category' });
    }

    // Validate priority (ensure it's a valid number between 1 and 4)
    const validPriorities = [1, 2, 3, 4];
    if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority level' });
    }

    // Validate deadline (make sure the deadline is a valid date)
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate)) {
        return res.status(400).json({ message: 'Invalid deadline format' });
    }

    try {
        const newTask = new Task({
            title,
            description,
            category, // The category ID
            priority, // The numeric priority level
            dueDate: deadlineDate, // Store the deadline as a Date object
            userId: req.user.id, // Attach user ID from the decoded token
        });

        const task = await newTask.save();
        console.log('Task Created:', task); // Log task creation
        res.status(201).json(task); // Return the created task
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
