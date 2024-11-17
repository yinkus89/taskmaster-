const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  priority: { type: Number, min: 1, max: 4, required: true },
  visibility: { type: String, enum: ["private", "public"], default: "private" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Task", taskSchema);
