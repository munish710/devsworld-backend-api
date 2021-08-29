const { BadRequestError } = require("../errors");
const Post = require("../models/post.model");

const createPost = async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    throw new BadRequestError("Please add all the fields");
  }
  const newPost = new Post({ title, body, postedBy: req.user.userID });
  const savedPost = await newPost.save();
  res.status(201).json({
    success: true,
    message: "Post created Successfully",
    post: savedPost,
  });
};

module.exports = { createPost };
