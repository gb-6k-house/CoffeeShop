var express = require('express');
var router = express.Router();
var wexin = require('../web-controllers/wexinPublicWeb')

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render("index.html", {title: "hello"});
});
router.post('/wexinmessage', wexin.handleMsg);
router.get('/wexinmessage', wexin.vetify);


module.exports = router;
