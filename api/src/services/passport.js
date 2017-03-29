const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/user');

const loginOption = {
  usernameField: 'email',
};

const localLogin = new LocalStrategy(loginOption, (email, password, done) => {
  User.findOne({email}, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    user.comparePassword(password, (err_, isMatch) => {
      if (err_) {
        return done(err_);
      }

      if (!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
});

passport.use(localLogin);
