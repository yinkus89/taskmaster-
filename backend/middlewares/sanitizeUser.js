const sanitizeUser = (req, res, next) => {
    // Assume req.body has user input fields
    if (req.body.username) {
        req.body.username = req.body.username.trim();
    }
    if (req.body.email) {
        req.body.email = req.body.email.trim().toLowerCase();
    }
    // Additional sanitization can go here
    next();
};

module.exports = sanitizeUser;
