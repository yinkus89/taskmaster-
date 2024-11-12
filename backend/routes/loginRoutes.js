// loginRoute.js
const express = require('express');
const User = require('../models/User'); // Ensure this path is correct
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');

// Use cookie-parser middleware for cookie handling
router.use(cookieParser());

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate request data
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the entered password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Payload
            process.env.JWT_SECRET, // Secret key
            { expiresIn: '1h' } // Token expiration time (1 hour)
        );

        // Send JWT token as a cookie (with HttpOnly flag for security)
        res.cookie('token', token, {
            httpOnly: true, // Cannot be accessed by client-side JS
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: 'Strict', // Prevents CSRF
            maxAge: 3600000, // 1 hour expiry (matches JWT expiry)
        });

        // Send a success message as a response body
        res.json({ message: 'Login successful' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
