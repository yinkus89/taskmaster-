const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler"); // Adjust path as needed

// Example routes
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/error", (req, res, next) => {
  // Example to test error handling
  const error = new Error("Something went wrong!");
  error.statusCode = 400;
  next(error);
});

// Other middlewares...
// Add the error handler at the end
app.use(errorHandler);
