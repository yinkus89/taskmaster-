// routes/category.js
const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// Create a new category
router.post('/', async (req, res) => {
    const { name, description, priorityLevel } = req.body;

    // Validate input
    if (!name || !description || !priorityLevel) {
        return res.status(400).json({ message: 'All fields (name, description, priorityLevel) are required' });
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const newCategory = new Category({ name, description, priorityLevel });

    try {
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
});

module.exports = router;
