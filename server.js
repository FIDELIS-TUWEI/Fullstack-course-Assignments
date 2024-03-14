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

app.get("/", (request, response) => {
    return response.send("Backend Server is running")
})

// get request for all persons
app.get("/api/persons", (request, response) => {
    Phonebook.find({}).then(persons => {
        response.json(persons)
    });
});

app.get("/info", (request, response) => {
    const timestamp = new Date().toString();
    const count = Phonebook.length;
    return response.send(
        `Phonebook has info for ${count} people 
        ${timestamp}
    `
    )
});

// post request
app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
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

// get request for a single resource
app.get("/api/persons/:id", (request, response, next) => {
    Phonebook.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error));
});

// put request for existing resource
app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    };

    Phonebook.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error));
})

// delete request
app.delete("/api/persons/:id", (request, response, next) => {
    Phonebook.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
});

// Unknown endpoints
const notFound = (request, response) => {
    response.status(404).send({ error: "Unknown Endpoint!" })
};

app.use(notFound);

// Error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        response.status(400).send({ error: "Malformatted ID" })
    }

    next(error)
};

app.use(errorHandler);

// Disable server fingerprinting
app.disable('x-powered-by');

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);