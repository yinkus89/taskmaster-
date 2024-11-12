const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },  // Assuming it's a string; adjust if you have a separate Category model
    priority: { type: String, required: true, enum: ['low', 'medium', 'high'] },  // Assuming priority can only be low, medium, high
    deadline: { type: Date },
    dueDate: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Task", taskSchema);
