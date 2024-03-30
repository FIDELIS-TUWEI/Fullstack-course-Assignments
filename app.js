const config = require("./utils/config");
const express = require("express");
const cors = require("cors");
const app = express();
const blogRouter = require("./controller/blogController");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const { default: mongoose } = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("Connecting to", config.MONGODB_URI);

// Database connection
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("Connected to MongoDB Database")
    })
    .catch((error) => {
        logger.error("Error connecting to MongoDB", error.message)
    });

app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);
app.disable("x-powered-by");

app.use('/api/v1/blogs', blogRouter);
app.use(middleware.unKnownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;