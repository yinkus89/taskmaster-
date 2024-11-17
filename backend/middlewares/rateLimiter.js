const express = require("express");
const loginLimiter = require("./middlewares/loginLimiter");
const authController = require("./controllers/authController");

const router = express.Router();

// Apply the rate limiter middleware to the login route
router.post("/login", loginLimiter, authController.login);

module.exports = router;
