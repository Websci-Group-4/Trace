
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// NOTE: Missing user indicates "Public" permission.

const Permission = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    can: {
        type: String,
        enum: ['VIEW', 'EDIT', 'OWN'],
        default: 'VIEW',
        required: true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "Image",
        required: true
    }
});

module.exports = mongoose.model("Permission", Permission);