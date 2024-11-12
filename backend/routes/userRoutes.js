const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware"); // Import your middleware to protect routes
const router = express.Router();

// Route to get the authenticated user's profile (protected route)
router.get("/profile", protect, async (req, res) => {
  try {
    // Find the user by the authenticated user's ID in req.user (set by the protect middleware)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive information like password
    const { password, salt, ...userData } = user.toObject(); // Consider other sensitive fields like salt

    res.json({
      message: "Profile retrieved successfully",
      profile: userData, // Send user data, excluding sensitive information
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
