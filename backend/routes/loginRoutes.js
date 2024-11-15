// authRoutes.js

const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Use cookie-parser middleware for cookie handling
router.use(cookieParser());

// Define rate limiter specifically for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 5 requests per 15 minutes
    message: "Too many login attempts, please try again after 15 minutes",
});

// Login route with rate limiter
router.post('/login', loginLimiter, async (req, res) => {
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
            { expiresIn: '30h' } // Token expiration time (30 hour)
        );

        // Send JWT token as a cookie (with HttpOnly flag for security)
        res.cookie('token', token, {
            httpOnly: true, // Cannot be accessed by client-side JS
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: 'Strict', // Prevents CSRF
            maxAge: 3600000, // 1 hour expiry (matches JWT expiry)
        });

        // Only send the token and status, no unnecessary info like "success" message
        res.json({ token }); // Send the token directly

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

module.exports = router;
