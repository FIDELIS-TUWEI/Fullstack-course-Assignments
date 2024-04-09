const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const Person = require("./models/person");
const config = require("./utils/config");
const logger = require("./utils/logger");
const errorHandler = require("./utils/errorHandler");

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};

mongoose.set("strictQuery", false);

logger.info("Connecting to MongoDB Database...");

// Database connection
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("Connected to MongoDB Database")
    })
    .catch((error) => {
        logger.error("Error connecting to MongoDB", error.message)
    });
  

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))
app.disable("x-powered-by");

app.get('/', (request, response) => {
    response.send('Backend Server is up and running...')
});

// get all persons
app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
});

// new person route
app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: "name or number missing" })
    }

    const person = new Person ({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        response.json(savedPerson)
    });
});

// get single resource with id
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error));
});

// update a resource route
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body;

    Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error));
})

// deleting a resource route
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
})

app.get('/info', (request, response) => {
    const timeReceived = new Date();
    const entriesCount = Person.length;

    const info = `
    <p>Phonebook has info for ${entriesCount}</p> 
    <p>${timeReceived}</p>
    `;

    response.send(info);
});

app.use(unknownEndpoint);
app.use(errorHandler);


module.exports = app;