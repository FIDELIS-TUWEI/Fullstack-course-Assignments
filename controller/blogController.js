const blogsRouter = require('express').Router();
const Blog = require("../models/blog");

blogsRouter.get('/', (request, response) => {
    response.send("Blog List Server running")
});

module.exports = blogsRouter;
