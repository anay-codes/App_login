// Error handling middleware
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map(val => val.message)
      .join(", ");
    return res.status(400).json({ success: false, message });
  }

  // Database errors
  if (err.code === "23505") {
    return res.status(400).json({ success: false, message: "Duplicate field value" });
  }

  if (err.code === "23503") {
    return res.status(400).json({ success: false, message: "Invalid reference" });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

module.exports = { AppError, errorHandler };
