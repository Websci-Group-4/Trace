
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Permission = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "Image",
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Permission", Permission);