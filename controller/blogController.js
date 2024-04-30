const blogsRouter = require('express').Router();
const Blog = require("../models/blog");

blogsRouter.get('/', (request, response) => {
    response.send("Blog List Server running")
});

// request to fetch all blogs
blogsRouter.get("/api/v1/blogs", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
})

// request to create new blog
blogsRouter.post("/api/v1/blogs", async (request, response, next) => {
    const blog = new Blog(request.body);

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog)
});

module.exports = blogsRouter;
