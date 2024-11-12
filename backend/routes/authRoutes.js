const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { userValidationRules } = require("../middlewares/validator");
const router = express.Router();

// Helper function for input validation
const validateInput = (data) => {
  const { username, email, password } = data;
  const errors = [];

  // Check username length
  if (!username || username.trim().length < 3) {
    errors.push("Username must be at least 3 characters long");
  }

  // Check email format
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push("Invalid email format");
  }

  // Check password strength
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return errors;
};

// Sign-up route
router.post("/signup", userValidationRules, User.validate, async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  const validationErrors = validateInput(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: validationErrors.join(", ") });
  }

  try {
    // Check if user already exists with email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password doesn't match" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });

    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

module.exports = router;
