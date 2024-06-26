const Blog = require("../models/blog.model");
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app);

const helper = require("./test_helper");

describe('where there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogs);
    });
});

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

    assert.strict(blogsAtEnd.length, helper.initialBlogs.length);

});

describe('delete single blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];
    
        await api
            .delete(`/api/v1/blogs/${blogToDelete.id}`)
            .expect(204);
        
            const blogsAtEnd = await helper.blogsInDb();
    
            assert.strict(blogsAtEnd.length, helper.initialBlogs.length - 1);
    
            const titles = blogsAtEnd.map(blog => blog.title);
            assert(titles.includes(blogToDelete.title));
    });
});

describe('update blog', () => {
    test('succeeds with status code 200 and update blog if valid id', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];

        const updatedLikes = blogToUpdate.likes + 1;

        const updatedBlog = await api
            .put(`/api/v1/blogs/${blogToUpdate.id}`)
            .send({ likes: updatedLikes })
            .expect(200)
            .expect("Content-Type", /application\/json/);

        assert.deepStrictEqual(updatedBlog.likes, updatedLikes);
    });
})


after(async () => {
    await mongoose.connection.close()
});