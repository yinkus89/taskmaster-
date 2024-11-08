const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3, // Add some validation for username length
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: emailRegex, // Validate email format
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
});

// Hash password before saving a new user (pre-save hook)
userSchema.pre('save', async function (next) {
  // Only hash the password if it's new or has been modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
  }
  next(); // Continue with saving the user
});

// Method to compare password (bcrypt)
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
