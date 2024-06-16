const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require("../app");
const api = supertest(app);

const helper = require("./test_helper");

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', name: 'Root User', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Martin Luukkainen',
            password: 'salainen',
        };

        await api
            .post("/api/v1/auth/signup")
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        
        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        assert(usernames.includes(newUser.username));
    });

    test('creation fails with proper statusCode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        };

        const result = await api
            .post("/api/v1/auth/signup")
            .send(newUser)
            .expect(409)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(result.body.message, "Username already exists");

        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('creation fails with proper statusCode and message if username or password is missing', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUserWithoutPassword = {
            username: 'newuser',
            name: 'No Password User',
        };

        let result = await api
            .post("/api/v1/auth/signup")
            .send(newUserWithoutPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(result.body.message, "Username, name and password are required");

        const newUserWithoutUsername = {
            name: 'No Username User',
            password: 'password',
        };

        result = await api
            .post("/api/v1/auth/signup")
            .send(newUserWithoutUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(result.body.message, "Username, name and password are required");

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('creation fails with proper statusCode and message if username or password is too short', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUserWithShortUsername = {
            username: 'us',
            name: 'Short Username User',
            password: 'password',
        };

        let result = await api
            .post("/api/v1/auth/signup")
            .send(newUserWithShortUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(result.body.message, "Username and Password must be atleast 3 characters long!");

        const newUserWithShortPassword = {
            username: 'username',
            name: 'Short Password User',
            password: 'pw',
        };

        result = await api
            .post("/api/v1/auth/signup")
            .send(newUserWithShortPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(result.body.message, "Username and Password must be atleast 3 characters long!");

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
});
