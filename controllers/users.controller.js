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

const getUserPosts = async (req, res) => {
  const posts = await Post.find({ postedBy: req.params.id }).populate({
    path: "postedBy",
    select: "_id name username",
  });

  if (!posts) {
    throw new BadRequestError("Posts Not found");
  }

  res.status(200).json({ success: true, message: "User's posts", posts });
};

module.exports = { getUserDetails, getUserPosts };
