const mongoose = require("mongoose");

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }

const password = process.argv[2];

const url = 
    `mongodb+srv://fidel-korir:${password}@fullstack-course.dwdrrrv.mongodb.net/fs-course?retryWrites=true&w=majority&appName=Fullstack-Course`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Phonebook = mongoose.model('Phonebook', phoneBookSchema);

const name = process.argv[3];
const number = process.argv[4];

if (!name || !number) {
    console.log("Name or Number is missing!");
    process.exit(1)
}

const phonebook = new Phonebook({ name, number });

phonebook.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
});