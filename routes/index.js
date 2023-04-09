var express = require("express");
var router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.messages = ["Not authorized"];
  return res.redirect("/login");
};

router.get("/", (req, res, next) => {
  res.render("index", { message: "" });
});

router.post("/", async (req, res, next) => {
  const { username, password, confirm } = req.body;
  if (password !== confirm) {
    return res.render("index", { message: "Passwords do not match" });
  }

  try {
    if (await User.findOne({ username })) {
      return res.render("index", { message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();
    res.redirect("/dashboard");
  } catch (err) {
    return next(err);
  }
});

router.get("/login", (req, res, next) => {
  let message = "";
  if (req.session.messages) {
    message = req.session.messages[0];
    req.session.messages = [];
  }
  res.render("login", { message });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureMessage: "Invalid login details",
    failureRedirect: "/login",
  }),
  (req, res, next) => {
    res.redirect("/dashboard");
  }
);

router.get("/dashboard", isAuth, (req, res, next) => {
  console.log("passed auth");
  res.send(req.user);
});

module.exports = router;
