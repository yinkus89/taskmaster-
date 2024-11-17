const mongoose = require("mongoose");
const Task = require("../models/Task");

const ownershipMiddleware = async (req, res, next) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Validate the task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: "Invalid task ID." });
    }

    try {
        const task = await Task.findById(taskId);

        // Check if the task exists
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        // Check if the logged-in user owns the task
        if (task.user.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to access this task." });
        }

        // Proceed if ownership is verified
        next();
    } catch (err) {
        console.error("Ownership middleware error:", err);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = ownershipMiddleware;
