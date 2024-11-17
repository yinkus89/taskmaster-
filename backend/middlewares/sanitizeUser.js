const sanitizeHtml = require("sanitize-html");

const sanitizeUser = (req, res, next) => {
    // Trim whitespace and normalize email
    if (req.body.username) {
        req.body.username = req.body.username.trim();
    }
    if (req.body.email) {
        req.body.email = req.body.email.trim().toLowerCase();
    }

    // Sanitize the bio field (strip HTML tags)
    if (req.body.bio) {
        req.body.bio = sanitizeHtml(req.body.bio, {
            allowedTags: [],
            allowedAttributes: {},
        });
    }

    // Enforce maximum length for username
    if (req.body.username && req.body.username.length > 50) {
        req.body.username = req.body.username.slice(0, 50);
    }

    // Escape special characters
    if (req.body.username) {
        req.body.username = escape(req.body.username);
    }

    next();
};

module.exports = sanitizeUser;
