const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // Check if the Authorization header exists and is properly formatted
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or malformed Authorization header. Use 'Bearer <token>'.",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract the token

    // Ensure the token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing in the 'Bearer <token>' format.",
      });
    }

    // Verify the token using the secret key
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired. Please log in again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
        error: err.message, // Include additional error details in dev mode
      });
    }

    // Validate token payload for userId
    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload: userId is missing.",
      });
    }

    // Fetch the user from the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in the database.",
      });
    }

    // Attach the user information to the request object
    req.user = user;

    // Proceed to the next middleware/route handler
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
      error: err.message,
    });
  }
};

module.exports = isAuthenticated;
