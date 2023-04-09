var express = require("express");
var router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Message = require("../models/message");
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

router.get("/dashboard", isAuth, async (req, res, next) => {
  const messages = await Message.find().populate("author").sort({ time: -1 });
  console.log(messages);
  res.render("dashboard", { messages });
});

router.get("/new-message", (req, res, next) => {
  res.render("new-message", { user: req.user.id });
});

router.post("/new-message", async (req, res, next) => {
  try {
    const { title, author, body } = req.body;
    const message = new Message({
      title,
      author,
      body,
    });

    await message.save();
    res.redirect("/dashboard");
  } catch (err) {
    return next(err);
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    return next(err);
  });
  req.session.messages = ["Successfully logged out"];
  res.redirect("/login");
});

module.exports = router;
