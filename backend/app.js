const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

const app = express(); // Initialize the app here

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

app.use(morgan("dev")); // Logging middleware
app.use(helmet()); // Secure HTTP headers
app.use(cookieParser()); // Cookie parsing middleware

// Enable CORS for your frontend
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // Allow sending cookies (JWT token)
};
app.use(cors(corsOptions));

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter); // Apply rate limiter

app.use(express.json()); // Parse JSON bodies

// Define routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/tasks", taskRoutes); // Task routes
app.use("/api/categories", categoryRoutes); // Category routes

// Global error handler - make sure this is after all route handlers
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});

// Start the server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
