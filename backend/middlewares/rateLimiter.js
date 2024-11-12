const rateLimit = require('express-rate-limit');

// Rate limiter specifically for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per 15 minutes
    message: "Too many login attempts, please try again after 15 minutes",
});

module.exports = loginLimiter;
