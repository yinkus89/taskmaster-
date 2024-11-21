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
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require('./middleware/authMiddleware'); // Authentication middleware

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
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

// Enable CORS
const corsOptions = {
  origin: `http://${process.env.CLIENT_ORIGIN}`,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiter setup
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(rateLimiter);

// Task routes (now only under taskRoutes)
app.use("/api/tasks", authMiddleware, taskRoutes); // Task-related routes (protected by authMiddleware)

// Other API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/tasks', taskRoutes);
// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy!" });
});

// Handle unhandled routes
app.all("*", (req, res, next) => {
  const error = new Error(`Cannot find ${req.originalUrl} on this server.`);
  error.status = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
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
const port = process.env.PORT || 5001;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server; // Export server for testing
