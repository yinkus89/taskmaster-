// Category model example (if you haven't already defined it)
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;

// Fetch categories route
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Route to get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
