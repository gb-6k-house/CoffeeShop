var express = require('express');
var wexin = require('../web-controllers/wexinPublicWeb')
var router = express.Router();
/* GET users listing. */
router.get('/pageAuthorize', wexin.pageAuthorize);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/points", function (req, res) {
  res.render("points.html");
});
router.get("/my", function (req, res) {
  res.render("user.html");
});

module.exports = router;
