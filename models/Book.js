const mongoose = require("mongoose");
require('mongoose-type-url');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  purchase: {
    type: mongoose.SchemaTypes.Url, required: true
  },
 
  pdf: {
    type: mongoose.SchemaTypes.Url, 
  },
  likes: {
    type: Number,
    required: true,
  },
  favorite: {
    type: Array,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("Book", BookSchema);
