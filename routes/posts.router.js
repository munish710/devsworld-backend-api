const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  myPosts,
} = require("../controllers/posts.controller");

router.route("/").get(getAllPosts).post(createPost);

router.route("/myposts").get(myPosts);

module.exports = router;
