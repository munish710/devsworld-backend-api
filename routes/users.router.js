const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserDetails,
  getUserPosts,
  followUser,
  unfollowUser,
  searchUser,
  updateUserDetails,
} = require("../controllers/users.controller");

router.route("/").get(getAllUsers);

router.route("/follow/:followUserID").patch(followUser);
router.route("/unfollow/:unfollowUserID").patch(unfollowUser);
router.route("/search").get(searchUser);

router.route("/:id").get(getUserDetails).post(updateUserDetails);
router.route("/:id/posts").get(getUserPosts);

module.exports = router;
