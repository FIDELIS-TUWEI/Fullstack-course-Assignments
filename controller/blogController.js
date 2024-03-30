const blogsRouter = require('express').Router();
const Blog = require("../models/blog");

blogsRouter.get('/', (request, response) => {
    response.send("Blog List Server running")
});

// request to fetch all blogs
blogsRouter.get("/api/v1/blogs", (request, response) => {
    Blog.find({})
        .then(blogs => {
            response.json(blogs);
        })
})

// request to create new blog
blogsRouter.post("/api/v1/blogs", (request, response, next) => {
    const blog = new Blog(request.body);

    blog.save()
        .then(result => {
            response.status(200).json(result)
        })
        .catch(error => next(error));
});

module.exports = blogsRouter;
