const express = require("express");
const cors = require("cors");
const Phonebook = require("./models/phoneBook");
const app = express();

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    console.log('---');
    next()
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Unknown endpoints
const notFound = (request, response) => {
    response.status(404).send({ error: "Unknown Endpoint!" })
}

app.get("/", (request, response) => {
    return response.send("Backend Server is running")
})

app.get("/api/persons", (request, response) => {
    Phonebook.find({}).then(persons => {
        response.json(persons)
    });
});

// get request for a single resource
app.get("/api/persons/:id", (request, response) => {
    Phonebook.findyId(request.params.id).then(person => {
        response.json(person)
    });
});

// post request
app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (body.content === undefined) {
        return response.status(400).json({
            error: "name or number missing!"
        });
    }

    const person = new Phonebook({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        response.json(savedPerson)
    });
});

// delete request
app.delete("/api/persons/:id", (request, response) => {

    response.status(204).end();
});

app.get("/info", (request, response) => {
    const timestamp = new Date().toString();
    const count = persons.length;
    return response.send(
        `Phonebook has info for ${count} people 
        ${timestamp}
    `
    )
});

app.use(notFound)
// Disable server fingerprinting
app.disable('x-powered-by');

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);