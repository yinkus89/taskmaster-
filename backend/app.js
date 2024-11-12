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
const categoryRoutes = require('./routes/categoryRoutes');

dotenv.config();

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

const app = express();
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
app.use('/api/categories', categoryRoutes); // Category routes

// Global error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log("SIGTERM received, shutting down gracefully...");
  app.close(() => {
    console.log("Process terminated");
  });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
