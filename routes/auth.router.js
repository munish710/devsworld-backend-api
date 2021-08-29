const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");

router.route("/register").get(register);
router.route("/login").post(login);

module.exports = router;
