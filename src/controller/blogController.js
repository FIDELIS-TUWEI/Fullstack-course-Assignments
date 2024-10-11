const blogsRouter = require('express').Router();
const Blog = require("../models/blog.model");
const User = require("../models/user.model");

// request to fetch all blogs
blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    response.json(blogs);
})

// request to create new blog
blogsRouter.post('/', async (request, response) => {
    const body = request.body;

    if (!body.title || !body.url) {
        return response.status(400).json({ error: 'Post missing title or url' });
    }

    // Fetch all users from the database
    const users = await User.find({})
    if (users.length === 0) {
        return response.status(500).json({ error: 'No users found in the database' });
    }

    // Randomly select a user to be the creator of the blog
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const likes = body.likes !== undefined ? body.likes : 0;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: likes,
        user: randomUser._id,
    });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
});

// request to fetch single source with id
blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id);

    if (!blog) return res.status(400).json({ error: "Blog not found" });

    response.status(200).json(blog);
})

// request to update blog 
blogsRouter.put("/:id", async (request, response) => {
    const blogId = request.params.id;
    const { likes } = request.body;
    const blog = await Blog.findById(blogId);

    if (!blog) return response.status(404).json({ error: "Blog not found" });

    blog.likes = likes;
    await blog.save();

    response.status(200).json(blog);
});

// request to delete a single resource
blogsRouter.delete("/:id", async (request, response) => {
    const blogId = request.params.id;

    const deleteBlog = await Blog.findByIdAndDelete(blogId);

    if (!deleteBlog) return response.status(404).json({ error: "Blog not found" });

    response.status(204).end();
});

module.exports = blogsRouter;
