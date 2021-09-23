require("dotenv").config();
const express = require("express");
require("express-async-errors");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const app = express();

const connectDB = require("./db/db.connect");
const errorHandlerMiddleware = require("./middleware/error-handler.middleware");
const notFoundMiddleware = require("./middleware/not-found.middleware");
const authMiddleware = require("./middleware/auth.middleware");

const authRouter = require("./routes/auth.router");
const postsRouter = require("./routes/posts.router");
const usersRouter = require("./routes/users.router");

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter({ windowMs: 60 * 1000, max: 60 }));

app.get("/", (req, res) => {
  res.send("Welcome to Social-Media-Backend-API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", authMiddleware, postsRouter);
app.use("/api/v1/users", authMiddleware, usersRouter);

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
