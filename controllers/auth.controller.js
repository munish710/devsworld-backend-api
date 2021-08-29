const User = require("../models/user.model");
const { BadRequestError, UnauthorizedError } = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  email = email.toLowerCase();
  let foundUser = await User.findOne({ email });
  if (!foundUser) {
    throw new UnauthorizedError("User doesn't exists, Please register");
  }

  const validatePassword = await bcrypt.compare(password, foundUser.password);
  if (!validatePassword) {
    throw new UnauthorizedError("Email or password is incorrect");
  }
  const token = jwt.sign(
    { userID: foundUser._id, username: foundUser.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  return res
    .status(200)
    .json({ success: true, message: "Successfully logged in", token });
};

module.exports = { register, login };
