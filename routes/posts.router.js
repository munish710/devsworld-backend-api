const express = require("express");
const router = express.Router();

const { createPost, getAllPosts } = require("../controllers/posts.controller");

router.route("/").get(getAllPosts).post(createPost);

module.exports = router;
