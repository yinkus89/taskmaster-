const Task = require("../models/Task"); // Adjust the path as necessary

 
 const getTasks = async (req, res) => {
  try {
    // Validate that the middleware is attaching the user ID to req.user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    // Find tasks for the authenticated user
    const tasks = await Task.find({ userId: req.user.id });

    // Return tasks
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Error fetching tasks." });
  }
};

module.exports = { getTasks };
