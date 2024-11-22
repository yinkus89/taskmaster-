const express = require("express");
const User = require("../models/User");
const isAuthenticated = require("../middleware/authMiddleware");
const router = express.Router();
const Task = require("../models/Task");



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

router.patch("/activate/:userId", isAuthenticated, async (req, res) => {
  try {
    // Only allow admin users to activate other users
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.isActive = true; // Activate user
    await user.save();
    res.status(200).json({ message: "User activated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error activating user." });
  }
});



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
