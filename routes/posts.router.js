const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  toggleLike,
  addComment,
  deletePost,
  myFeed,
} = require("../controllers/posts.controller");

router.route("/").get(getAllPosts).post(createPost);

router.route("/myfeed").get(myFeed);

router.route("/:postID").delete(deletePost);
router.route("/:postID/toggle-like").patch(toggleLike);
router.route("/:postID/comment").patch(addComment);

module.exports = router;
