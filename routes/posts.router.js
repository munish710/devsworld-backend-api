const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  myPosts,
  toggleLike,
} = require("../controllers/posts.controller");

router.route("/").get(getAllPosts).post(createPost);

router.route("/myposts").get(myPosts);

router.route("/:postID/toggle-like").post(toggleLike);

module.exports = router;
