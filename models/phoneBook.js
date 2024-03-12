const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB database');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB database', error);
    })

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String,
});

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

module.exports = mongoose.model('Phonebook', phoneBookSchema);
