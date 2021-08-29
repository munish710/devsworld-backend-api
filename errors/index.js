const BadRequestError = require("./bad-request");
const CustomAPIError = require("./custom-error");
const UnauthorizedError = require("./unauthorized");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthorizedError,
};
