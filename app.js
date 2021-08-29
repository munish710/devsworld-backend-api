require("dotenv").config();
const express = require("express");
require("express-async-errors");

const app = express();

const connectDB = require("./db/db.connect");
const errorHandlerMiddleware = require("./middleware/error-handler.middleware");
const notFoundMiddleware = require("./middleware/not-found.middleware");

const authRouter = require("./routes/auth.router");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Social-Media-Backend-API");
});

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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
