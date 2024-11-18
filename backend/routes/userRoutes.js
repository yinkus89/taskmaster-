const express = require("express");
const User = require("../models/User");
const isAuthenticated = require("../middleware/authMiddleware");
const router = express.Router();


// Get profile data for the authenticated user


router.get('/api/user/profile', isAuthenticated, async (req, res) => {
  try {
    // Assuming `req.user` contains the authenticated user object
    const user = req.user;
    res.json({
      success: true,
      userProfile: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
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

    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Enforce schema validation
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, salt, ...userData } = updatedUser.toObject();
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
// GET /api/tasks/user/:userId
// GET /api/tasks/user/:userId
router.get("/user/:userId", isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await Task.find({ userId }).populate('categoryId', 'name');
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});


module.exports = router;
