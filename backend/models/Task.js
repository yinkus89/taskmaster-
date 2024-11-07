const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value > Date.now(),
      message: 'Due date must be in the future',
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Create an index for userId for faster queries
taskSchema.index({ userId: 1 });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;

