const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const morgan = require('morgan');

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

const app = express();
const server = http.createServer(app);

const config = {
  secret: 'This is secret',
};

function tokenForUser(user) {
  return jwt.encode({
    sub: user._id,
    iat: new Date().getTime(),
  }, config.secret);
}

// model
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

// index
mongoose.connect('mongodb://localhost:todolist/todolist');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function handleSignup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({error: 'You must provide email and password'});
  }

  User.findOne({email}, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({error: 'Email is in use.'});
    }

    const user = new User({email, password});

    user.save(err_ => {
      if (err_) {
        if (err_.errors && err_.errors.email) {
          return res.status(422).send({error: err_.errors.email.message});
        }
        return next(err);
      }

      res.json({token: tokenForUser(user), userId: user._id});
    });
  });
}

function handleSignin(req, res, next) {
  res.json({token: tokenForUser(req.user), userId: req.user._id});
}

app.use('/v1', new express.Router()
  .post('/signup', handleSignup)
  .post('/signin', handleSignin)
);

console.log(`listening on http://${host}:${port}`);
server.listen(port, host);
