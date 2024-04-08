const logger = require("../utils/logger");

const errorHandler = (error, response, request, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};

module.exports = errorHandler;