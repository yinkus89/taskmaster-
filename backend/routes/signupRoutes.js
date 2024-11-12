const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Sign-up route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '30d', // Adjust token expiration as necessary
        });

        // Send the token as a cookie
        res.cookie('token', token, {
            httpOnly: true, // Make it HTTP-only to prevent XSS attacks
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        });

        // Send success message and optionally the token
        res.status(201).json({
            message: 'User created successfully',
            // token: token, // Optionally send token in response body
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
