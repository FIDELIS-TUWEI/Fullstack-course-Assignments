const logger = require("../utils/logger");

const errorHandler = (error, response, request, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message)
        return response.status(400).json({ errors });
    }

    next(error);
};

module.exports = errorHandler;