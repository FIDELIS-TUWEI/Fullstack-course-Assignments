const logger = require("./logger");

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:", request.path);
    logger.info("Body:", request.body);
    logger.info("---");

    next()
};

// Unknown endpoint
const unKnownEndpoint = (request, response) => {
    response.status(404).json({ error: "Unknown Endpoint" })
};

// Error middleware
const errorHandler = (error, request, response, next) => {
    logger.error = error.message;

    if (error.name === 'CastError') {
        response.status(400).json({ error: "Malformatted ID" })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    

    next(error);
};

module.exports = {
    requestLogger, unKnownEndpoint, errorHandler
};