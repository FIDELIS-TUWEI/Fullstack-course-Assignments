const express = require("express");
const cors = require("cors");
const app = express();
const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.use(express.json());
app.use(cors());
app.disable("x-powered-by");

app.get('/', (request, response) => {
    response.send('Backend Server running...')
})

// get all persons
app.get('/api/persons', (request, response) => {
    response.json(persons);
});

// get single resource with id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

// deleting a resource route
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})

app.get('/info', (request, response) => {
    const timeReceived = new Date();
    const entriesCount = persons.length;

    const info = `
        Phonebook has info for ${entriesCount}<br /> ${timeReceived}
    `;

    response.send(info);
});

module.exports = app;