const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Category = require('../models/Category');
const isAuthenticated = require('../middlewares/authMiddleware');
const ownershipMiddleware = require('../middlewares/ownershipMiddleware');

// Create a new task - POST /api/tasks
router.post('/api/tasks', isAuthenticated, async (req, res) => {
  const { title, description, deadline, categoryId, priority, visibility } = req.body;

  // Validate required fields
  if (!title || !description || !deadline || !categoryId || priority === undefined) {
    return res.status(400).json({ 
      success: false,
      message: 'All fields (title, description, deadline, categoryId, and priority) must be filled out.' 
    });
  }

  // Validate categoryId (must be a valid ObjectId)
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid category ID.' 
    });
  }

  // Validate priority (must be a number between 1 and 4)
  const validPriorities = [1, 2, 3, 4];
  if (!validPriorities.includes(Number(priority))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid priority value. Priority must be a number between 1 and 4.',
    });
  }

  try {
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found.' 
      });
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      deadline,
      category: categoryId, // Reference to Category model
      priority: Number(priority), // Ensure priority is stored as a number
      visibility,
      userId: req.user._id, // Store the user's ID for task ownership
    });

    await newTask.save();
    res.status(201).json({ 
      success: true,
      message: 'Task created successfully!', 
      task: newTask 
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create task. Please try again.' 
    });
  }
});

// GET all tasks for the authenticated user - GET /api/tasks
router.get('/', isAuthenticated, async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  // Validate page and limit are numbers
  if (isNaN(page) || isNaN(limit)) {
    return res.status(400).json({ message: 'Page and limit must be numbers.' });
  }

  const filter = { userId: req.user._id };

  if (category) {
    filter.category = category;
  }

  try {
    const tasks = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);
    res.status(200).json({
      success: true,
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to load tasks.' });
  }
});

// GET a specific task - GET /api/tasks/:taskId
router.get('/:taskId', isAuthenticated, ownershipMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate('category', 'name description');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({ success: false, message: 'Error fetching task details.' });
  }
});

// GET public tasks (no authentication required) - GET /api/tasks/public
router.get('/public', async (req, res) => {
  const { deadline, priority } = req.query;
  const filter = { visibility: 'public' };

  if (deadline) {
    filter.deadline = { $lte: new Date(deadline) }; // Tasks due before deadline
  }

  if (priority) {
    filter.priority = parseInt(priority);
  }

  try {
    const publicTasks = await Task.find(filter);
    res.status(200).json({ success: true, tasks: publicTasks });
  } catch (error) {
    console.error('Error fetching public tasks:', error);
    res.status(500).json({ success: false, message: 'Error fetching public tasks.' });
  }
});

// UPDATE a task - PUT /api/tasks/:taskId
router.put('/:taskId', isAuthenticated, ownershipMiddleware, async (req, res) => {
  const { title, description, deadline, categoryId, priority, visibility } = req.body;

  // Validate priority range
  if (priority && (priority < 1 || priority > 4)) {
    return res.status(400).json({ message: 'Priority must be between 1 and 4.' });
  }

  try {
    // If categoryId is provided, validate it
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // If categoryId exists, check if category exists
    let category = null;
    if (categoryId) {
      category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        title,
        description,
        deadline,
        category: category ? category._id : undefined, // Update only if categoryId exists
        priority,
        visibility: visibility || 'private', // Default visibility to private if not provided
      },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json({ message: 'Task updated successfully.', task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task.' });
  }
});

module.exports = router;
