// backend-code-gen/middlewares/errorMiddleware.js
/**
 * Custom error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default error status is 500 (Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error for debugging
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Send error response to client
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };