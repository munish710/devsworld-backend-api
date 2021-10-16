const { BadRequestError, UnauthorizedError } = require("../errors");
const Post = require("../models/post.model");
const User = require("../models/user.model");

const getAllPosts = async (req, res) => {
  const allPosts = await Post.find()
    .populate({ path: "postedBy", select: "_id username avatarUrl name" })
    .populate({
      path: "comments.postedBy",
      select: "_id username avatarUrl name",
    })
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, message: "All posts", posts: allPosts });
};

const createPost = async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    throw new BadRequestError("Please add all the fields");
  }
  const newPost = new Post({
    title,
    body,
    postedBy: req.user.userID,
    imageUrl: req.body.imageUrl ?? "",
  });
  const savedPost = await newPost.save();
  let fullPost = await savedPost.populate([
    {
      path: "postedBy",
      select: "_id username avatarUrl name",
    },
    {
      path: "comments.postedBy",
      select: "_id username avatarUrl name",
    },
  ]);

  res.status(201).json({
    success: true,
    message: "Post created Successfully",
    post: fullPost,
  });
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
  )
    .populate({ path: "postedBy", select: "_id username avatarUrl name" })
    .populate({
      path: "comments.postedBy",
      select: "_id username avatarUrl name",
    });

  if (!updatedPost) {
    throw new BadRequestError("Couldn't add your comment");
  }
  res.status(200).json({
    success: true,
    message: "Comment added successfully",
    post: updatedPost,
  });
};

const deletePost = async (req, res) => {
  const { postID } = req.params;
  const foundPost = await Post.findById(postID).populate({
    path: "postedBy",
    select: "_id",
  });
  if (!foundPost) {
    throw new BadRequestError("Post not found");
  }

  if (foundPost.postedBy._id.toString() === req.user.userID) {
    await foundPost.remove();
    res
      .status(200)
      .json({ success: true, message: "Successfully deleted the post" });
  } else {
    throw new UnauthorizedError("You are not authorized to delete this post");
  }
};

const myFeed = async (req, res) => {
  const { userID } = req.user;
  const userDetails = await User.findById(userID);
  const feedUsers = [...userDetails.following, userID];
  //if postedBy id matches id of people user follows
  const myFeedPosts = await Post.find({ postedBy: { $in: feedUsers } })
    .populate({ path: "postedBy", select: "_id username avatarUrl name" })
    .populate({
      path: "comments.postedBy",
      select: "_id username avatarUrl name",
    })
    .sort({ createdAt: -1 });

  //might have to comment out below code.

  if (!myFeedPosts) {
    throw new BadRequestError("No posts found");
  }
  res.status(200).json({
    success: true,
    message: "Posts by people you follow",
    posts: myFeedPosts,
  });
};

const getPost = async (req, res) => {
  const { postID } = req.params;
  const foundPost = await Post.findById(postID)
    .populate({ path: "postedBy", select: "_id username avatarUrl name" })
    .populate({
      path: "comments.postedBy",
      select: "_id username avatarUrl name",
    });
  if (!foundPost) {
    throw new BadRequestError("Post not found");
  }
  res
    .status(200)
    .json({ success: true, message: "Post Details", post: foundPost });
};

const deleteComment = async (req, res) => {
  const { userID } = req.user;
  const { postID } = req.params;
  const { commentID } = req.body;
  const foundPost = await Post.findById(postID);
  if (!foundPost) {
    throw new BadRequestError("Incorrect post ID");
  }
  let deleteCommentIndex = -1;
  foundPost.comments.forEach((comment, index) => {
    if (
      comment.postedBy._id.toString() === userID &&
      comment._id.toString() === commentID
    ) {
      deleteCommentIndex = index;
    }
  });

  if (deleteCommentIndex != -1) {
    foundPost.comments.splice(deleteCommentIndex, 1);
    await foundPost.save();

    let fullPost = await foundPost.populate([
      {
        path: "postedBy",
        select: "_id username avatarUrl name",
      },
      {
        path: "comments.postedBy",
        select: "_id username avatarUrl name",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      post: fullPost,
    });
  } else {
    throw new BadRequestError("You cannot delete this comment");
  }
};

module.exports = {
  createPost,
  getAllPosts,
  toggleLike,
  addComment,
  deletePost,
  myFeed,
  getPost,
  deleteComment,
};
