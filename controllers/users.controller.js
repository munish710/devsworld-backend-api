const { BadRequestError } = require("../errors");
const Post = require("../models/post.model");
const User = require("../models/user.model");

const getUserDetails = async (req, res) => {
  const { id } = req.params;
  const foundUser = await User.findById(id).select("-password");
  if (!foundUser) {
    throw new BadRequestError("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User details",
    user: foundUser,
  });
};

module.exports = { getUserDetails };
