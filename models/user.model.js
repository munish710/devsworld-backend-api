const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minLength: 3,
      maxLength: 50,
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      minLength: 3,
      maxLength: 20,
      unique: [true, "Username alreay exists"],
    },
    email: {
      type: String,
      required: [true, "Please provide Email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: [true, "Email already registered"],
    },
    password: {
      type: String,
      required: [true, "Please provide a Password"],
      minLength: 6,
    },
    bio: { type: String, default: "" },
    avatarUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/munish-cloud/image/upload/v1633378162/user9_oruatz.jpg",
    },
    link: {
      type: String,
      default: "",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
