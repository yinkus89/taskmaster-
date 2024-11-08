const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure the category name is unique
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true, // Removes any extra spaces from the description
    },
    priorityLevel: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4], // Limiting the priority levels to 1, 2, 3, or 4
        default: 4, // Default priority level is 4 (lowest priority)
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});

// Creating the Category model from the schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
