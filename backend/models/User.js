const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures the email is unique across the database
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving a new user (pre-save hook)
userSchema.pre('save', async function(next) {
  // Only hash the password if it's new or has been modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
  }
  next(); // Continue with saving the user
});

// Method to compare password (bcrypt)
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
