const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }, 
  password: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: 'https://res.cloudinary.com/ddhuhurjc/image/upload/v1612715433/noimage_ujbfpf.jpg',
  },
  followers: [{type: ObjectId, ref: 'User'}],
  following: [{type: ObjectId, ref: 'User'}]
});

userSchema.pre('save', async function (next) {
  console.log("Inside userSchema.pre()");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post('save', function (doc, next) {
  console.log('new user was created and saved to db');
  next();
});

userSchema.methods.generateAuthToken = function (params) {
  const token = jwt.sign({name: this.name}, config.get('jwtPrivateKey'), {expiresIn: '1h'});
  // the second parameter is to be taken during runtime from env vars, via cfgs.
  // check config folder -> default.json and custom-environment-variables.json 
  return token;
}

const User=mongoose.model('User', userSchema);

function validateRegistration(user) {
  const {name, email, password} = user;

  const schema = {
      name: Joi.string().min(5).max(255).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
  }
  return Joi.validate({name, email, password}, schema);
}

function validateLogin(user) {
  console.log(user.email);
  const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
  }
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateRegistration = validateRegistration;
module.exports.validateLogin = validateLogin;