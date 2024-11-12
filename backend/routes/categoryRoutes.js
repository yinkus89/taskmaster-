// routes/category.js
const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// Get all categories (with optional pagination)
router.get('/', async (req, res) => {
    try {
        // Optional pagination using query params (page, limit)
        const { page = 1, limit = 10 } = req.query;
        
        // Fetch categories with pagination logic
        const categories = await Category.find()
            .skip((page - 1) * limit)  // Skip categories based on the page number
            .limit(parseInt(limit));   // Limit categories returned
        
        // Get the total count for pagination info
        const totalCategories = await Category.countDocuments();
        
        // Send the response with pagination details
        res.json({
            categories,
            totalCategories,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / limit),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// Create a new category
router.post('/', async (req, res) => {
    const { name, description, priorityLevel } = req.body;

    // Validate input
    if (!name || !description || priorityLevel === undefined) {
        return res.status(400).json({ message: 'All fields (name, description, priorityLevel) are required' });
    }

    // Validate priorityLevel (should be 1, 2, 3, or 4)
    if (![1, 2, 3, 4].includes(priorityLevel)) {
        return res.status(400).json({ message: 'Priority level must be 1, 2, 3, or 4' });
    }

    try {
        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }

        // Create a new category
        const newCategory = new Category({
            name,
            description,
            priorityLevel,
        });

        // Save the category to the database
        await newCategory.save();

        // Respond with the created category
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
});

module.exports = router;
