const Blog = require("../models/blog");

const initialBlogs = [
    {
        _id: '65ed1532b6eb2b4391edb017',
        title: "Psychology of Money",
        author: "Morgan Housel",
        url: "https://psychologyofmoney.org",
        likes: 100
    },
    {
        _id: '65ed1532b6eb2b4391edb027',
        title: "Rationl Male",
        author: "Rollo Tomassi",
        url: "https://rationalmale.info",
        likes: 105
    }
];

const nonExistingId = async () => {
    const blog = new Blog({ title: '48 laws of power' })
    await blog.save()
    await blog.deleteOne();

    return blog._id.toString();
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
};