const userRouter = require("express").Router()
const User = require("../models/user.model");

userRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 });

    response.json(users);
})

module.exports = userRouter;