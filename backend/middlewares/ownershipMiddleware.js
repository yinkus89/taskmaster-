const Task = require('../models/Task');

const ownershipMiddleware = async (req, res, next) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    try {
        const task = await Task.findById(taskId);
        if (!task || task.user.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = ownershipMiddleware;
