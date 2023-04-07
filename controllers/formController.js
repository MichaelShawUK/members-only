const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.register_post = async (req, res, next) => {
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound) {
      res.send("USER ALREADY EXISTS");
    }

    // const error = new Error("CUSTOM error!");
    // error.status = 401;
    // throw error;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    await user.save();
    res.send("User details saved");
    // res.redirect("/login");
  } catch (err) {
    return next(err);
  }
};

exports.login_post = passport.authenticate("local", {
  successRedirect: "/success",
  failureRedirect: "/login",
});
