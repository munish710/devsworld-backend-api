const express = require("express");
const router = express.Router();

const {
  getUserDetails,
  getUserPosts,
} = require("../controllers/users.controller");

router.route("/:id").get(getUserDetails);
router.route("/:id/posts").get(getUserPosts);

module.exports = router;
