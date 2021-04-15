
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Organization = new Schema({
	name: {
        type: String,
        required: true
    },
    baseUrls: [{
        type: String,
        required: true
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("Organization", Organization);