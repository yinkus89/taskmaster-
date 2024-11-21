const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    // Extract the Authorization header
    const authHeader = req.header("Authorization");

    // Check if the Authorization header exists and is properly formatted
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or malformed. Use 'Bearer <token>'.",
      });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Handle different JWT verification errors
      const message =
        err.name === "TokenExpiredError"
          ? "Token has expired. Please log in again."
          : "Invalid token. Please log in again.";
      return res.status(401).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { error: err.message }), // Include error in dev mode
      });
    }

    // Ensure the token has a valid userId
    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload: userId is missing.",
      });
    }

    // Retrieve the user from the database using the userId from the decoded token
    const user = await User.findById(decoded.userId);

    // If no user found, return 404
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in the database.",
      });
    }

    // Attach the user information to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
      ...(process.env.NODE_ENV === "development" && { error: err.message }), // Include error in dev mode
    });
  }
};

module.exports = isAuthenticated;
 