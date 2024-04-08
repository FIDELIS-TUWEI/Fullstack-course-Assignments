//const config = require('./utils/config');
const express = require("express");
//const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
//const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
//const logger = require('./utils/logger');

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
app.use(middleware.requestLogger)
app.disable("x-powered-by");

app.get('/', (request, response) => {
    response.send('Backend Server running...')
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    const timeReceived = new Date();
    const entriesCount = persons.length;

    const info = `
        Phonebook has info for ${entriesCount}\n ${timeReceived}
    `;

    response.send(info);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;