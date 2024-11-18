const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes"); // This line should already be there
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// MongoDB connection setup
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware setup
app.use(morgan("dev")); // Log requests
app.use(helmet()); // Security headers
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies

// Enable CORS for frontend
const corsOptions = {
  origin: `http://${process.env.CLIENT_ORIGIN}`,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiter to prevent abuse
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Health check route (not rate-limited)
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy!" });
});

// Apply rate limiter globally
app.use(rateLimiter);

// Welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Task Manager API!",
    endpoints: {
      users: "/api/users",
      auth: "/api/auth",
      tasks: "/api/tasks",
      categories: "/api/categories",
    },
  });
});

// Define API routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/tasks", taskRoutes); // Task-related routes
app.use("/api/categories", categoryRoutes); // Category-related routes

// Handle unhandled routes
app.all("*", (req, res, next) => {
  const error = new Error(`Cannot find ${req.originalUrl} on this server.`);
  error.status = 404;
  next(error);
});

// Global error handler middleware
app.use(errorHandler);

// Graceful shutdown on SIGTERM signal
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    server.close(() => {
      console.log("Process terminated");
    });
  });
});

// Start the server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server; // Export server for testing
