// models/Category.js

const mongoose = require('mongoose');

// Define the schema for the Category model
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,  // Name is required
      unique: true,    // Category name should be unique
      minlength: 3,    // Minimum length for name
      maxlength: 100   // Maximum length for name
    },
    description: {
      type: String,
      required: true,  // Description is required
      minlength: 5,    // Minimum length for description
      maxlength: 255   // Maximum length for description
    },
    createdAt: {
      type: Date,
      default: Date.now  // Automatically set the creation date
    },
    updatedAt: {
      type: Date,
      default: Date.now  // Automatically set the update date
    }
  },
  {
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
);

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
