const express = require('express');
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator'); // express-validator
const router = express.Router();

// Input validation middleware using express-validator
const userValidationRules = [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email address'), // Email validation
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Sign-up route with validation
router.post('/signup', userValidationRules, validate, async (req, res) => {
    const { username, email, password } = req.body;
    res.status(201).json({ message: "User signed up successfully" });
    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '30d', // Token expiration time
        });

        // Send the token as a cookie
        res.cookie('token', token, {
            httpOnly: true, // Secure cookie, not accessible via JS
            secure: process.env.NODE_ENV === 'production', // Secure only in production
            sameSite: 'Strict', // Added for CSRF protection
        });

        // Send success message
        res.status(201).json({
            message: 'User created successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
