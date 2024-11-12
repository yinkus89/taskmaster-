const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Email validation regex (more robust version)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Username validation regex (allow alphanumeric characters, underscores, and hyphens)
const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      match: usernameRegex, // Validate username format
      unique: true, // Ensure the username is unique
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
      minlength: 8, // Updated minimum password length
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(v); // Password should contain letters, numbers, and a special character
        },
        message: 'Password must contain at least one letter, one number, and one special character.',
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false, // Add email verification flag
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Hash password before saving a new user (pre-save hook)
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10); // Generate salt
      this.password = await bcrypt.hash(this.password, salt); // Hash the password
    }
    next(); // Continue with saving the user
  } catch (error) {
    next(error); // Pass error to next middleware if hashing fails
  }
});

// Method to compare password (bcrypt)
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate auth token (JWT)
userSchema.methods.generateAuthToken = function () {
  const payload = { id: this._id, username: this.username, email: this.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
  return token;
};

// Create index on email and username for quick lookups
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
