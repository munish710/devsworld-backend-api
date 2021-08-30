const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  body: {
    type: String,
    requied: [true, "Body of the post is required"],
  },
  imageUrl: {
    type: String,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      postedBy: { type: ObjectId, ref: "User" },
    },
  ],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", PostSchema);
