const errorHandler = (err, req, res, next) => {
  let customError = {
    message: err.message || "Something went wrong",
    statusCode: err.statusCode || 500,
  };

  if (err.code === 11000 && err.keyPattern.username === 1) {
    (customError.message = "username already taken"),
      (customError.statusCode = 400);
  }

  return res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
  });
};

module.exports = errorHandler;
