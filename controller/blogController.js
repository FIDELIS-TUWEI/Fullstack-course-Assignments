const blogsRouter = require('express').Router();
const Blog = require("../models/blog");

blogsRouter.get('/', (request, response) => {
    response.send("Blog List Server running")
});

// request to fetch all blogs
blogsRouter.get("/blogs", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
})

// request to create new blog
blogsRouter.post("/blogs", async (request, response, next) => {
    const body = request.body;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        ur: body.url,
        likes: body.likes
    });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog)
});

// request to fetch single source with id
blogsRouter.get("/blog/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id);

    if (!blog) return res.status(400).json({ error: "Blog not found" });

    res.status(200).json(blog);
})

module.exports = blogsRouter;
