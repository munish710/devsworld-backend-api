const express = require("express");
const router = express.Router();

const { getUserDetails } = require("../controllers/users.controller");

router.route("/:id").get(getUserDetails);
module.exports = router;
