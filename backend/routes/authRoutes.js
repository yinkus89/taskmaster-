const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Your User model
const router = express.Router();

// Define the validateInput function
const validateInput = (data) => {
  const { email, password, username } = data;
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push("Username must be at least 3 characters long");
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push("Invalid email format");
  }
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  return errors;
};

 

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body; // Destructure name from the request body

    if (!name || !email || !password) { // Validate that all required fields are present
      return res.status(400).json({ message: "All fields are required" });
    }

    // Proceed to create and save the user
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "User creation failed" });
  }
});


// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email or password is missing
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send the token as a response
    res.status(200).json({ token });

  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
