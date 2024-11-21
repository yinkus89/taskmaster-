// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('Error stack:', err.stack);  // Log the error stack for debugging purposes
  res.status(err.statusCode || 500).json({
    message: err.message || 'Something went wrong!'  // Return custom message or a generic one
  }); 
};

module.exports = errorHandler;  // Export the error handler
