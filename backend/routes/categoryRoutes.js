const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // To add validation for request body

// Get all categories (with optional pagination)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Fetch categories with pagination logic
        const categories = await Category.find()
            .skip((page - 1) * limit)  // Skip categories based on the page number
            .limit(parseInt(limit));   // Limit categories returned

        // Get the total count for pagination info
        const totalCategories = await Category.countDocuments();

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

// Create a new category with validation
router.post(
    '/',
    [
        check('name', 'Category name is required').not().isEmpty(),
        check('description', 'Description must be at least 10 characters long').isLength({ min: 10 }),
        check('priorityLevel', 'Priority level must be between 1 and 4').isInt({ min: 1, max: 4 }),
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, priorityLevel } = req.body;

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
    }
);

// Fetch category by ID (optional additional feature)
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
});

module.exports = router;
