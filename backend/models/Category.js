const mongoose = require('mongoose');

// Define Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: [true, 'Category name must be unique'],
      trim: true,
      minlength: [3, 'Category name must be at least 3 characters long'],
      maxlength: [50, 'Category name cannot be more than 50 characters long'],
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    priorityLevel: {
      type: Number,
      required: [true, 'Priority level is required'],
      enum: {
        values: [1, 2, 3, 4],
        message: 'Priority level must be between 1 and 4',
      },
      default: 4,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional, but useful if you want to track the updater
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create an index on the 'name' field to make lookups faster
categorySchema.index({ name: 1 });

// Static method to activate the category
categorySchema.statics.activateCategory = async function (categoryId) {
  return await this.findByIdAndUpdate(categoryId, { status: 'active' }, { new: true });
};

// Static method to archive the category
categorySchema.statics.archiveCategory = async function (categoryId) {
  return await this.findByIdAndUpdate(categoryId, { status: 'archived' }, { new: true });
};

// Create and export the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
