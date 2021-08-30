const { BadRequestError } = require("../errors");
const Post = require("../models/post.model");

const getAllPosts = async (req, res) => {
  const allPosts = await Post.find().populate({
    path: "postedBy",
    select: "_id name username",
  });

  res
    .status(200)
    .json({ success: true, message: "All posts", posts: allPosts });
};

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

const myPosts = async (req, res) => {
  const posts = await Post.find({ postedBy: req.user.userID }).populate({
    path: "postedBy",
    select: "_id name username",
  });

  res.status(200).json({ success: true, message: "your posts", posts });
};

module.exports = { createPost, getAllPosts, myPosts };
