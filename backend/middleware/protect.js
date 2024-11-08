const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

const protect = async (req, res, next) => {
    let token;

    // Extract token from cookies
    if (req.cookies.token) {
        token = req.cookies.token; // Cookie name should be 'token'
    }

    // If no token is provided, return unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = protect;
