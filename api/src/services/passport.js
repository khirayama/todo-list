const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const config = {
  secret: 'This is secret',
};

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

const jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromHeader('authorization')
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
});

passport.use(localLogin);
passport.use(jwtLogin);
