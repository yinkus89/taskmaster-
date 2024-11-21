// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, default: "pending" },
  category: { type: String, required: true },
  priority: { type: String, required: true },
  visibility: { type: String, enum: ["public", "private"], default: "private" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // assuming tasks belong to users
});

module.exports = mongoose.model("Task", taskSchema);
