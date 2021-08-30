const express = require("express");
const router = express.Router();

const {
  getUserDetails,
  getUserPosts,
  followUser,
} = require("../controllers/users.controller");

router.route("/follow/:followUserID").patch(followUser);

router.route("/:id").get(getUserDetails);
router.route("/:id/posts").get(getUserPosts);

module.exports = router;
