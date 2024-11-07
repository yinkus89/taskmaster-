const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Sign-up
router.post('/api/signup', async (req, res) => {  // Corrected path
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists' });

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/api/login', async (req, res) => {  // Corrected path
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
