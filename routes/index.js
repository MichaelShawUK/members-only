var express = require("express");
var router = express.Router();
const formController = require("../controllers/formController");

/* GET home page. */
router.get("/", (req, res, next) => {
  console.log(req.user);
  res.render("index");
});

router.post("/", formController.register_post);

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", formController.login_post);

module.exports = router;
