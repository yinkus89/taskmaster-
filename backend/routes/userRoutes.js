const express = require("express");
const User = require("../models/User");
const isAuthenticated = require("../middlewares/authMiddleware"); // Import authentication middleware
const sanitizeUser = require("../middlewares/sanitizeUser"); // Assuming this sanitizes input for updates

const router = express.Router();

// Route to get the authenticated user's profile (protected route)
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    // Find the user by the authenticated user's ID in req.user (set by the isAuthenticated middleware)
    const user = await User.findById(req.user._id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive information like password, salt, etc.
    const { password, salt, ...userData } = user.toObject();

    // Send back the user profile, excluding sensitive information
    res.json({
      message: "Profile retrieved successfully",
      profile: userData,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message || "An unknown error occurred",
    });
  }
});

// Route to update the authenticated user's profile
router.put("/profile", isAuthenticated, sanitizeUser, async (req, res) => {
  try {
    // Find the user by the authenticated user's ID
    const user = await User.findById(req.user._id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user profile with sanitized data
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });

    // Exclude sensitive information from the response
    const { password, salt, ...userData } = updatedUser.toObject();

    // Send back the updated user profile
    res.json({
      message: "Profile updated successfully",
      profile: userData,
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message || "An unknown error occurred",
    });
  }
});

module.exports = router;
