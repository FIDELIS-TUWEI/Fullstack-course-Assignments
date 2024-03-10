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

async function listEntries() {
    try {
        const entries = await Phonebook.find({});
        console.log("phonebook:");
        entries.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`);
        });
    } catch (err) {
        console.error("Error fetching phonebook entries:", err);
    } finally {
        mongoose.connection.close();
    }
}

if (process.argv.length === 3) {
    listEntries();
} else {
    const name = process.argv[3].replace('/-/g', ' ');
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
}
