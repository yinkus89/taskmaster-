const express = require("express");
const User = require("../models/User");
const isAuthenticated = require("../middleware/authMiddleware");
const router = express.Router();
const Task = require("../models/Task");

// Get profile data for the authenticated user


// Get user profile with tasks
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    // Fetch authenticated user data
    const user = await User.findById(req.user._id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch tasks associated with the authenticated user
    const tasks = await Task.find({ userId: req.user._id });

    res.status(200).json({ user, tasks });
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({
      message: "Failed to fetch profile and tasks",
      error: err.message,
    });
  }
});



// Route to update the authenticated user's profile
router.patch("/profile", isAuthenticated, async (req, res) => {
  try {
    const allowedUpdates = ["name", "email", "avatar"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((key) => allowedUpdates.includes(key));

    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid fields in update" });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Enforce schema validation
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive data like password
    const { password, ...profile } = updatedUser.toObject();
    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    console.error("Error updating user profile:", err.message);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});


// GET /api/tasks/user/:userId
router.get("/user/:userId", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;

    // Optional: Add admin or ownership validation
    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch tasks for the specific user
    const tasks = await Task.find({ userId }).populate("categoryId", "name");

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});


module.exports = router;
