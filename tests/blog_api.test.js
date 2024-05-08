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

    const resultBlog = await api
        .get(`/api/v1/blogs/${blog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/).toHaveProperty('id')

    assert.deepStrictEqual(resultBlog.body, blog);
});

after(async () => {
    await mongoose.connection.close()
});