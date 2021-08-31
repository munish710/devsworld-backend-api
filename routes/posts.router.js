const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  toggleLike,
  addComment,
  deletePost,
  myFeed,
  getPost,
  deleteComment,
} = require("../controllers/posts.controller");

router.route("/").get(getAllPosts).post(createPost);

router.route("/myfeed").get(myFeed);

router.route("/:postID").get(getPost).delete(deletePost);
router.route("/:postID/toggle-like").patch(toggleLike);
router.route("/:postID/comment").patch(addComment).delete(deleteComment);

module.exports = router;
