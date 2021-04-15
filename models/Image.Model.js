
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Image = new Schema({
    url: {
        type: String,
        required: true
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: "Permission"
    }],
    views: [{
        type: Schema.Types.ObjectId,
        ref: "View"
    }],
});

module.exports = mongoose.model("Image", Image);