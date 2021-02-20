const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const Joi = require('joi');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');



const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  likes: [{type: ObjectId, ref: "User"}],
  comments: [{
    text: String,
    postedBy: {
      type: ObjectId,
      ref:"User"
    }
  }],
  postedBy: {
    type: ObjectId,
    ref:"User"
  }
});

const Post = mongoose.model('Post', postSchema);

function validatePost (post) {
  const {title, body, photo} = post;
  const schema = {
      title: Joi.string().min(5).max(255).required(),
      body: Joi.string().min(5).max(255).required(),
      photo: Joi.string().required(),
  }
  return Joi.validate({title, body, photo}, schema);
}

module.exports.Post = Post;
module.exports.validatePost = validatePost;