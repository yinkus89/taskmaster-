const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
