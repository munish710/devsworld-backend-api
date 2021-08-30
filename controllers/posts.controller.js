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

const toggleLike = async (req, res) => {
  const { postID } = req.params;
  const { userID } = req.user;
  let isLiked = false;
  const foundPost = await Post.findById(postID);

  if (!foundPost) {
    throw new BadRequestError("The post doesn't exists");
  }

  let index = foundPost.likes.indexOf(userID);
  if (index === -1) {
    foundPost.likes.push(userID);
    isLiked = true;
  } else {
    foundPost.likes.splice(index, 1);
  }

  await foundPost.save();

  res.status(200).json({
    success: true,
    message: "Like toggled",
    isLiked,
  });
};

const addComment = async (req, res) => {
  const { postID } = req.params;
  const { userID } = req.user;
  const comment = {
    text: req.body.comment,
    postedBy: userID,
  };
  const updatedPost = await Post.findByIdAndUpdate(
    postID,
    {
      $push: { comments: comment },
    },
    { new: true }
  ).populate({ path: "comments.postedBy", select: "_id username" });
  res.status(200).json({
    success: true,
    message: "Comment added successfully",
    post: updatedPost,
  });
};

module.exports = { createPost, getAllPosts, myPosts, toggleLike, addComment };
