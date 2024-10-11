const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const blogsRouter = require("./controller/blogController");
const authRouter = require("./controller/auth.controller");
const userRouter = require("./controller/user.controller");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

mongoose.set("strictQuery", false);

logger.info("Connecting to Database...");

// Database connection
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("Connected to MongoDB Database")
    })
    .catch((error) => {
        logger.error("Error connecting to MongoDB", error.message)
    });

app.use(express.json({ limit: "5mb" })); // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)
app.use(cors());
app.use(middleware.requestLogger);
app.disable("x-powered-by");

app.use('/api/v1/blogs', blogsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(middleware.unKnownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;