const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    name: {
        type: String
    },
    number: { type: String }
});

personSchema.set('toJSON', {
    transform: (document, returnedOject) => {
        returnedOject.id = returnedOject._id.toString()
        delete returnedOject._id
        delete returnedOject.__v
    }
});

module.exports = mongoose.model("Person", personSchema);