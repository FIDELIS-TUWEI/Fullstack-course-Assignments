const express = require("express");
const app = express();

app.use(express.json());

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
];

app.get("/", (request, response) => {
    return response.send("Backend Server is running")
})

app.get("/api/persons", (request, response) => {
    return response.json(persons);
});

// get request for a single resource
app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => {
        return person.id === id
    });

    if (person) {
        return response.json(person);
    } else {
        return response.status(404).end();
    }
});

// delete request
app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id)

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

// Disable server fingerprinting
app.disable('x-powered-by');

const PORT = 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);