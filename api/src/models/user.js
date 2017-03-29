const mongoose = require('mongoose');

const validateEmail = email => (/\S+@\S+.\S+/).test(email);

const User = mongoose.model('user', new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please enter a valid email'],
  },
  password: {type: String},
}));

