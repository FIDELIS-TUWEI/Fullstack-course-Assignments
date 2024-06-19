const blogsRouter = require('express').Router();
const Blog = require("../models/blog.model");
const User = require("../models/user.model");

blogsRouter.get('/', (request, response) => {
    response.send("Blog List Server running")
});

// request to fetch all blogs
blogsRouter.get("/blogs", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    response.json(blogs);
})

// request to create new blog
blogsRouter.post("/blogs", async (request, response) => {
    const body = request.body;

    // Include the user who created the blog
    //const userId = request.user._id;
    const user = await User.findOne().select("-password");

    if (!user) {
        return response.status(404).json({ error: `User with ID: ${userId} not found` })
    }

    if (!body.title || !body.url) return response.status(400).json({ error: "Post Missing title or url" });

    // set likes to 0 if missing in request
    const likes = body.likes !== undefined ? body.likes : 0;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        ur: body.url,
        likes: likes,
        user: user._id
    });


    const savedBlog = await blog.save();
    response.status(201).json(savedBlog)
});

// request to fetch single source with id
blogsRouter.get("/blog/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id);

    if (!blog) return res.status(400).json({ error: "Blog not found" });

    response.status(200).json(blog);
})

// request to update blog 
blogsRouter.put("/api/blogs/:id", async (request, response) => {
    const blogId = request.params.id;
    const { likes } = request.body;
    const blog = await Blog.findById(blogId);

    if (!blog) return response.status(404).json({ error: "Blog not found" });

    blog.likes = likes;
    await blog.save();

    response.status(200).json(blog);
});

// request to delete a single resource
blogsRouter.delete("/blogs/:id", async (request, response) => {
    const blogId = request.params.id;

    const deleteBlog = await Blog.findByIdAndDelete(blogId);

    if (!deleteBlog) return response.status(404).json({ error: "Blog not found" });

    response.status(204).end();
});

module.exports = blogsRouter;
