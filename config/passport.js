const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const verify = async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const stategy = new LocalStrategy(verify);

passport.use(strategy);
