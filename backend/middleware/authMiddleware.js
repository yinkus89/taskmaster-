const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    // Extract the Authorization header
    const authHeader = req.header("Authorization");

    // Check if the Authorization header exists and is properly formatted
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("Authorization header missing or malformed:", authHeader);
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or malformed. Use 'Bearer <token>'.",
      });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];
    console.log("Token extracted from header:", token);

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
    } catch (err) {
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
      console.log("Invalid token payload: userId is missing.");
      return res.status(401).json({
        success: false,
        message: "Invalid token payload: userId is missing.",
      });
    }

    // Retrieve the user from the database using the userId from the decoded token
    const user = await User.findById(decoded.userId);
    console.log("User fetched from database:", user);

    // If no user found, return 404
    if (!user) {
      console.log("User not found in the database.");
      return res.status(404).json({
        success: false,
        message: "User not found in the database.",
      });
    }

    // Optionally, add more authorization logic, e.g., check if user is active
    if (!user.isActive) {
      console.log("User is not active. Access denied.");
      return res.status(403).json({
        success: false,
        message: "User is not active. Access denied.",
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
