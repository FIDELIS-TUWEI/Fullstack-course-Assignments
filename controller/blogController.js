const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get('/', (request, response) => {
    response.send("Blog List Server running")
});

module.export = blogRouter;
