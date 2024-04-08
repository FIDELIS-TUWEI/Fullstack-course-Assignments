const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const Person = require("./models/person");
const config = require("./utils/config");
const logger = require("./utils/logger");

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};

mongoose.set("strictQuery", false);

logger.info("Connecting to", config.MONGODB_URI);

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
    response.send('Backend Server running...')
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    const person = new Person ({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        response.json(savedPerson)
    });
})

// get all persons
app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })

});

// get single resource with id
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            logger.error(error);
            response.status(500).end();
        })
});

// deleting a resource route
app.delete('/api/persons/:id', (request, response) => {
    

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

app.use(unknownEndpoint);


module.exports = app;