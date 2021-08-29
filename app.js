require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./db/db.connect");

app.get("/", (req, res) => {
  res.send("Welcome to Social-Media-Backend-API");
});

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
