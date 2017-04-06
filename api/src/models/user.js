const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const validateEmail = email => (/\S+@\S+.\S+/).test(email);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please enter a valid email'],
  },
  password: {type: String},
  todos: {
    id: {type: String},
    text: {type: String},
  },
});

userSchema.pre('save', (next) => {
  const user = this;

  if (user.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = (candidatePassword, callback) => {
  const user = this;
  bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    callback(null, isMatch);
  });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
