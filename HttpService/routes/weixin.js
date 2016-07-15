/**
 * Created by niupark on 16/7/12.
 */
var express = require('express');
var router = express.Router();
var weixinPublic = require('../http-controllers/weixinPublicHttp');

//router.get('/createMenue',weixin.createMenu);
//router.get('/deleteMenue',weixin.deleteMenue);
router.post('/jsReady', weixinPublic.jsReady);
router.post('/userInfo', weixinPublic.userInfo);
module.exports = router;