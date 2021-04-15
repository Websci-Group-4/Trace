
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Permission = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    can: {
        type: String,
        required: true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "Image",
        required: true
    }
});

module.exports = mongoose.model("Permission", Permission);