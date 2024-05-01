const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const Person = require("./models/person");
const config = require("./utils/config");
const logger = require("./utils/logger");
const errorHandler = require("./utils/errorHandler");

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};

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
  

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))
app.disable("x-powered-by");

app.use('/api/v1', blogsRouter);
app.use(middleware.unKnownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;