var express = require("express");
var router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Message = require("../models/message");
const bcrypt = require("bcryptjs");

const redirectLoggedIn = (req, res, next) => {
  if (req?.session?.passport?.user) {
    return res.redirect("/dashboard");
  }
  next();
};

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.messages = ["Not authorized"];
  return res.redirect("/login");
};

router.get("/", redirectLoggedIn, (req, res, next) => {
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
    res.redirect("/login");
  } catch (err) {
    return next(err);
  }
});

router.get("/login", redirectLoggedIn, (req, res, next) => {
  let message = "";
  if (req?.session?.messages?.[0]) {
    message = req.session.messages[0];
    delete req.session.messages;
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
  console.log(req.user);
  const isMember = req.user.isMember;
  const isAdmin = req.user.isAdmin;

  const messages = await Message.find().populate("author").sort({ time: -1 });
  res.render("dashboard", { messages, isMember, isAdmin });
});

router.post("/dashboard", async (req, res, next) => {
  try {
    await Message.deleteOne({ _id: req.body.messageId });
    res.redirect("/dashboard");
  } catch (err) {
    return next(err);
  }
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

router.get("/membership", async (req, res, next) => {
  const user = await User.findById(req.session.passport.user);
  user.isMember = true;
  await user.save();
  res.redirect("/dashboard");
});

router.get("/admin", (req, res, next) => {
  let message = "";
  if (req?.session?.messages?.[0]) {
    message = req.session.messages[0];
    delete req.session.messages;
  }
  res.render("admin", { message });
});

router.post("/admin", async (req, res, next) => {
  if (req.body.password !== "admin") {
    req.session.messages = ["Incorrect password"];
    return res.redirect("/admin");
  }
  try {
    const user = await User.findById(req.session.passport.user);
    user.isMember = true;
    user.isAdmin = true;
    await user.save();
    res.redirect("/dashboard");
  } catch (err) {
    return next(err);
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    const user = await User.findById(req.session.passport.user);
    user.isAdmin = false;
    await user.save();
  } catch (err) {
    return next(err);
  }
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.messages = ["Successfully logged out"];
    res.redirect("/login");
  });
});

module.exports = router;
