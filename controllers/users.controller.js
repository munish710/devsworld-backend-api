const { BadRequestError, UnauthorizedError } = require("../errors");
const Post = require("../models/post.model");
const User = require("../models/user.model");

const getAllUsers = async (req, res) => {
  const allUsers = await User.find().select("_id username avatarUrl name");
  res
    .status(200)
    .json({ success: true, message: "All the users from DB", users: allUsers });
};

const getUserDetails = async (req, res) => {
  const { id } = req.params;
  const foundUser = await User.findById(id)
    .select("-password")
    .populate({ path: "followers", select: "_id username avatarUrl name" })
    .populate({ path: "following", select: "_id username avatarUrl name" });
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
  const posts = await Post.find({ postedBy: req.params.id })
    .populate({
      path: "postedBy",
      select: "_id name username avatarUrl",
    })
    .populate({
      path: "comments.postedBy",
      select: "_id username avatarUrl name",
    })
    .sort({ createdAt: -1 });

  if (!posts) {
    throw new BadRequestError("Posts Not found");
  }

  res.status(200).json({ success: true, message: "User's posts", posts });
};

const followUser = async (req, res) => {
  const { followUserID } = req.params;
  const { userID } = req.user;

  const userToFollow = await User.findById(followUserID);
  if (!userToFollow) {
    throw new BadRequestError("User you want to follow doesn't exists");
  }

  if (userToFollow.followers.indexOf(userID) != -1) {
    throw new BadRequestError("You already follow this user.");
  } else {
    userToFollow.followers.push(userID);
    await userToFollow.save();
  }

  await User.findByIdAndUpdate(
    userID,
    {
      $push: { following: followUserID },
    },
    {
      new: true,
    }
  );

  const updatedUser = await User.findById(followUserID)
    .select("-password")
    .populate({ path: "followers", select: "_id username avatarUrl name" })
    .populate({ path: "following", select: "_id username avatarUrl name" });

  res.status(200).json({
    success: true,
    message: "Followed user successfully",
    user: updatedUser,
  });
};

const unfollowUser = async (req, res) => {
  const { unfollowUserID } = req.params;
  const { userID } = req.user;

  const userToUnfollow = await User.findById(unfollowUserID);
  if (!userToUnfollow) {
    throw new BadRequestError("User you want to unfollow doesn't exists");
  }

  let index = userToUnfollow.followers.indexOf(userID);
  if (index != -1) {
    userToUnfollow.followers.splice(index, 1);
    await userToUnfollow.save();
  } else {
    throw new BadRequestError("You don't follow this user.");
  }

  await User.findByIdAndUpdate(
    userID,
    {
      $pull: { following: unfollowUserID },
    },
    {
      new: true,
    }
  );

  const updatedUser = await User.findById(unfollowUserID)
    .select("-password")
    .populate({ path: "followers", select: "_id username avatarUrl name" })
    .populate({ path: "following", select: "_id username avatarUrl name" });

  res.status(200).json({
    success: true,
    message: "Unfollowed user successfully",
    user: updatedUser,
  });
};

const searchUser = async (req, res) => {
  const { user } = req.query;
  const queryPattern = new RegExp("^" + user.toLowerCase());
  const foundUsers = await User.find({
    username: { $regex: queryPattern },
  }).select("_id username avatarUrl name");
  res
    .status(200)
    .json({ success: true, message: "List of users", users: foundUsers });
};

const updateUserDetails = async (req, res) => {
  const { userID } = req.user;
  const { id } = req.params;
  if (userID !== id) {
    throw new UnauthorizedError("You can't edit other user's details");
  }
  const { avatarUrl, name, bio, link } = req.body;
  const userDetails = await User.findById(id).select("-password");
  userDetails.avatarUrl = avatarUrl;
  userDetails.name = name;
  userDetails.bio = bio;
  userDetails.link = link;
  await userDetails.save();

  const updatedUser = await User.findById(id)
    .select("-password")
    .populate({ path: "followers", select: "_id username avatarUrl name" })
    .populate({ path: "following", select: "_id username avatarUrl name" });

  res.status(201).json({
    success: true,
    message: "Succesfully updated user details",
    user: updatedUser,
  });
};

module.exports = {
  getAllUsers,
  getUserDetails,
  getUserPosts,
  followUser,
  unfollowUser,
  searchUser,
  updateUserDetails,
};
