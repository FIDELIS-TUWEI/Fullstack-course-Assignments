const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app);

const helper = require("./test_helper");
const Blog = require("../models/blog");

test.only('blogs are returned as json', async () => {
    await
        api
        .get('/api/v1/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
});


test('should return object with id property', async () => {
    const blog = await helper.blogsInDb();

    const blogToView = blog[0]

    const resultBlog = await api
        .get(`/api/v1/blogs/${blog.id}`)
        .expect('Content-Type', /application\/json/)

    assert(resultBlog.body, blogToView);
});

test('should create a new blog post', async () => {
    const newBlog = {
        title: "Atomic Habits",
        author: "James Clear",
        url: "https://atomichabits.blog",
        likes: 200
    };

    await api
        .post(`/api/v1/blogs`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(blog => blog.title);
    assert(titles.includes('Atomic Habits'));
});

test('should default likes to 0 if missing from request', async () => {
    const newBlog = {
        title: "Default likes",
        author: "Robert Greene",
        url: "https://defaultlikes.blog"
    };

    const resultBlog = await api
        .post(`/api/v1/blogs`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    assert.strictEqual(resultBlog.body.likes, 0);
});

test('fails with status code 400 if missing title or url from request', async () => {
    const newBlog = {
        author: "John Doe",
        url: "https://missingtitle.blog",
        likes: 100
    };

    await api
        .post(`/api/v1/blogs`)
        .send(newBlog)
        .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

})

after(async () => {
    await mongoose.connection.close()
});