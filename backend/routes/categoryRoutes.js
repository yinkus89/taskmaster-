const express = require('express');
const Category = require('../models/Category');
const { check, validationResult } = require('express-validator'); // For validation
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');

// Get all categories (with pagination)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Validate page and limit
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({ message: 'Invalid pagination parameters' });
        }

        // Fetch categories with pagination logic
        const categories = await Category.find()
            .skip((page - 1) * limit)  // Skip categories based on the page number
            .limit(parseInt(limit))    // Limit categories returned
            .sort({ priorityLevel: 1 }); // Optional: Sort by priority

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
router.post(
    '/',
    isAuthenticated, // Add authentication middleware
    [
        check('name', 'Category name is required').not().isEmpty(),
        check('description', 'Description must be at least 10 characters long').isLength({ min: 10 }),
        check('priorityLevel', 'Priority level must be between 1 and 4').isInt({ min: 1, max: 4 }),
    ],
    async (req, res) => {
        // Only allow admins to create categories
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, priorityLevel } = req.body;

        try {
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ message: 'Category with this name already exists' });
            }

            const newCategory = new Category({
                name,
                description,
                priorityLevel,
            });

            await newCategory.save();
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
