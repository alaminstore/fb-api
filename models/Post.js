const { text } = require("express");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
      max: 65000,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      // if we want to hide password for every user collection's json response
      transform(doc, ret) {
        delete ret.password;
      },
    },
  }
);

module.exports = mongoose.model("Post", postSchema);
