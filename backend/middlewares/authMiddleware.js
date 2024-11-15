const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  console.log("Authorization Header:", req.header("Authorization"));
  console.log("Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    const user = await User.findById(decoded.userId);
    console.log("User fetched from DB:", user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found in the database" });
    }

    req.user = user; // Attach user to the request object
    next(); // Proceed to next middleware/route
  } catch (err) {
    console.error("JWT verification error:", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = isAuthenticated;
