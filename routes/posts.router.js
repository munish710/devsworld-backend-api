const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  myPosts,
  toggleLike,
  addComment,
  deletePost,
} = require("../controllers/posts.controller");

router.route("/").get(getAllPosts).post(createPost);

router.route("/myposts").get(myPosts);

router.route("/:postID").delete(deletePost);
router.route("/:postID/toggle-like").patch(toggleLike);
router.route("/:postID/comment").patch(addComment);

module.exports = router;
