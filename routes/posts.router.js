const express = require("express");
const router = express.Router();

const { createPost } = require("../controllers/posts.controller");

router.route("/").post(createPost);

module.exports = router;
