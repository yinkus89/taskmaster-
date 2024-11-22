const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const user = req.user; // User from middleware
    if (!user) {
      return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    const visibilityFilter = req.query.visibility; // Get visibility filter
    let filter = {};

    if (visibilityFilter) {
      // Validate visibility filter
      if (!["public", "private"].includes(visibilityFilter)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid visibility filter. Use 'public' or 'private'." 
        });
      }
      filter.visibility = visibilityFilter;
    } else {
      // Default filter for public or private tasks of the user
      filter = {
        $or: [
          { visibility: "public" },
          { visibility: "private", userId: user._id }
        ]
      };
    }

    // Pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Log to check the filter and pagination
    console.log("Fetching tasks with filter:", filter);
    console.log(Page:${page}, Limit: ${limi})

    // Fetch tasks
    const tasks = await Task.find(filter).skip(skip).limit(limit);
    const totalTasks = await Task.countDocuments(filter);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ success: false, message: "No tasks found." });
    }

    return res.status(200).json({
      success: true,
      tasks,
      page,
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (err) {
    console.error("Error fetching tasks:", err.message, err.stack);
    return res.status(500).json({
      success: false,
      message: "Error fetching tasks.",
      error: err.message,  // Send more details in the error message for debugging
    });
  }
};

module.exports = { getTasks };