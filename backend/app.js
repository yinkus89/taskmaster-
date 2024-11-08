const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes"); // Import user routes
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
app.use(
  cors({
    origin: "*", // Adjust this for specific front-end origins if needed
  })
 ); 

 // Enable CORS for your frontend
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // Allow sending cookies (JWT token)
};
// Use CORS middleware
app.use(cors(corsOptions));

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Cookie parsing middleware

// Define routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/tasks", taskRoutes); // Task routes
app.use('/api/categories', categoryRoutes);

// Global error handler (optional, but useful)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
