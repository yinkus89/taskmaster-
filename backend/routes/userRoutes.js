// routes/userRoutes.js

const express = require('express');
const User = require('../models/User');
const protect = require('../middleware/protect'); // Import your middleware to protect routes
const router = express.Router();

// Route to get a user by ID (protected route)
router.get('/:id', protect, async (req, res) => {
    const { id } = req.params;  // Get user ID from URL parameters

    try {
        // Check if the ID in the request matches the authenticated user's ID (if you want to restrict access)
        if (req.user.id !== id) {
            return res.status(403).json({ message: 'Forbidden: You can only view your own profile' });
        }

        // Find the user by ID
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data (excluding password)
        const { password, ...userData } = user.toObject();
        res.json(userData);  // Send user data, excluding sensitive information
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
