const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    priority: { type: Number, required: true, min: 1, max: 4 },
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },  // reference to Category model
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
