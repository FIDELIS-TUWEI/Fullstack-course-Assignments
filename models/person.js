const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d{8,}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedOject) => {
        returnedOject.id = returnedOject._id.toString()
        delete returnedOject._id
        delete returnedOject.__v
    }
});

module.exports = mongoose.model("Person", personSchema);