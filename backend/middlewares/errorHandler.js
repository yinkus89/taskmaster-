const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    const response = {
      message: err.message || 'Internal Server Error',
    };
  
    if (process.env.NODE_ENV === 'development') {
      response.stack = err.stack;
    }
  
    res.status(err.statusCode || 500).json(response);
  };
  
  module.exports = errorHandler;
  