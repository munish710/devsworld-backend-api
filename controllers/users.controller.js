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

  res
    .status(200)
    .json({ success: true, message: "Followed user successfully" });
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

  res
    .status(200)
    .json({ success: true, message: "Unfollowed user successfully" });
};

module.exports = { getUserDetails, getUserPosts, followUser, unfollowUser };
