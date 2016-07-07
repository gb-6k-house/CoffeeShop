var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/points", function (req, res) {
  res.render("points");
});
router.get("/my", function (req, res) {
  res.render("user");
});
module.exports = router;
