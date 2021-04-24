const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema({
  url: {
    type: String,
    required: true,
  },
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  ],
  views: [
    {
      type: Schema.Types.ObjectId,
      ref: "View",
      required: true,
    },
  ],
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
    required: true,
  },
});

module.exports = mongoose.model("Image", Image);
