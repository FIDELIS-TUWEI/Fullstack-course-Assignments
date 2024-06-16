const bcrypt = require("bcrypt");
const authRouter = require("express").Router();
const User = require("../models/user.model");

authRouter.post("/signup", async (request, response) => {
    const { username, name, password } = request.body;

    // check if username is unique
    const checkUser = await User.findOne({ username });

    if (checkUser) {
        return response.status(409).json({ error: "Username already exists" });
    };

    // check if username and password is provided
    if (!username || !name || !password) {
        return response.status(400).json({ error: "Username, name and password are required" })
    };

    // check username and password length
    if (username.length < 3 || password.length < 3) {
        return response.status(400).json({ error: "Username and Password must be atleast 3 characters long!" });
    };

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username, 
        name,
        passwordHash
    });

    if (username && password) {
        const savedUser = await user.save();
        response.status(201).json(savedUser);
    } else {
        return response.status(400).json({ error: "Invalid user data" })
    };
});

module.exports = authRouter;