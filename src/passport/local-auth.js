const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require('path');
const fs = require('fs');

const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      // console.log(req.body)
      const user = await User.findOne({ email: req.body.email });
      // console.log(user);
      if (user) {
        console.log('That email have been already taken')
        return done(null, false, {
          message: "That email have been already taken",
        });
      } else {
        const newUser = new User();
        newUser.username = username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(password);
        let mediapath = `/media/tomas/Nuevo vol/${username}`
        fs.mkdir(mediapath, (err) => {
          if (err){
            console.log(err);
          }
        });
        newUser.path = mediapath;
        // newUser.path = `/media/tomas/device/${this.username}`;
        console.log(newUser);
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "user not found" });
      }
      if (!user.comparePassword(password)) {
        return done(null, false, { message: "incorrect password" });
      }
      return done(null, user);
    }
  )
);
