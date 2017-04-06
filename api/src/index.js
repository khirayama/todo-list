const http = require('http');

const passport = require('passport');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const morgan = require('morgan');

const passportService = require('./services/passport');
const User = require('./models/user');

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

const app = express();
const server = http.createServer(app);

const requireSignin = passport.authenticate('local', {session: false});

const config = {
  secret: 'This is secret',
};

function tokenForUser(user) {
  return jwt.encode({
    sub: user._id,
    iat: new Date().getTime(),
  }, config.secret);
}

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

function handleTodoNew(req, res, next) {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      return next(err);
    }

    const text = req.body.text;

    user.todos.push({
      id: uuid.v4(),
      text,
    });
    user.save(err_ => {
      if (err_) {
        return next(err_);
      }
      res.json({text});
    });
  });
}

app.use('/v1', new express.Router()
  .post('/signup', handleSignup)
  .post('/signin', [requireSignin, handleSignin])
  .post('/users/:userId/todos/new', handleTodoNew)
);

console.log(`listening on http://${host}:${port}`);
server.listen(port, host);
