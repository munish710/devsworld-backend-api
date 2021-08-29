const { BadRequestError } = require("../errors");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const register = async (req, res) => {
  let { email, name, username, password } = req.body;
  if (!email || !name || !username || !password) {
    throw new BadRequestError("Incomplete user details. Check form data");
  }
  email = email.toLowerCase();
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    throw new BadRequestError("User already exists");
  } else {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      name,
      username,
      password,
    });
    return res
      .status(201)
      .json({
        success: true,
        message: "User ceated successfully",
        user: newUser,
      });
  }
};

const login = async (req, res) => {
  res.json("login user");
};

module.exports = { register, login };
