const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming User model exists
const Task = require("../models/Task"); // Assuming Task model exists
const router = express.Router();

// Middleware imports
const authenticate = require("../middleware/authMiddleware");
const ownershipMiddleware = require("../middleware/ownershipMiddleware");
const loginLimiter = require("../middleware/loginLimiter"); // Assuming you've created this middleware

// Input validation
const Joi = require("joi");

const userValidationSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const validateInput = (data) =>
  userValidationSchema.validate(data, { abortEarly: false });

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  const { error } = validateInput({ username, email, password });
  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((e) => e.message).join(", ") });
  }

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email is already in use" });

    // Check if username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username is already taken" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res
      .status(500)
      .json({
        message: "User creation failed due to a server error",
        error: error.message,
      });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request received:", { email, password });

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    console.log("User lookup result:", user);

    if (!user) {
      console.log("User not found for email:", normalizedEmail);
      return res.status(400).json({ message: "Validation failed: User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password for email:", normalizedEmail);
      return res.status(400).json({ message: "Validation failed: User not found" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30h" });
    console.log("JWT token generated:", token);

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Update task route (PUT)
router.put(
  "/tasks/:id",
  authenticate,
  ownershipMiddleware,
  async (req, res) => {
    const taskId = req.params.id;
    const { title, description, completed } = req.body;

    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Check if the task belongs to the logged-in user
      if (task.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You can only update your own tasks" });
      }

      // Update task
      task.title = title || task.title;
      task.description = description || task.description;
      task.completed = completed !== undefined ? completed : task.completed;

      await task.save();
      res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating task", error: error.message });
    }
  }
);

// Delete task route (DELETE)
router.delete(
  "/tasks/:id",
  authenticate,
  ownershipMiddleware,
  async (req, res) => {
    const taskId = req.params.id;

    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Check if the task belongs to the logged-in user
      if (task.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You can only delete your own tasks" });
      }

      // Delete task
      await task.remove();
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting task", error: error.message });
    }
  }
);

module.exports = router;
