const mongoose = require("mongoose");

const personSchema = new Schema({
    name: String,
    number: Number
});

module.exports = mongoose("Person", personSchema);