const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    // For development
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
