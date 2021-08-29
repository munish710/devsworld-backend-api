const customAPIError = require("../errors");

const errorHandler = (err, req, res) => {
  if (err instanceof customAPIError) {
    return res.status(err.statusCode).json({ msg: error.message });
  }

  return res.status(500).json("Something went wrong please try again later");
};

module.exports = errorHandler;
