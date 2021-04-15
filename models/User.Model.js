
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String,
        required: true
    },
	firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization"
    },
    role: {
        type: String
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: "Permission"
    }]
});

module.exports = mongoose.model("User", User);