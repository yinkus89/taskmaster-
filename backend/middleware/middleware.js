// middleware/protect.js

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', ''); // Token from cookies or Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your JWT_SECRET
        req.user = decoded; // Attach the decoded user data to the request object
        next(); // Proceed to the next middleware/route
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports = protect;
