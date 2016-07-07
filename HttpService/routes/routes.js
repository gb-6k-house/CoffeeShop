/**
 * Created by niupark on 16/1/6.
 */
var mainHttp = require('../http-controllers/mainHttp');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/hello',mainHttp.hello);
//express().use('/home/getNewMsg',home.getNewMsg);
module.exports = router;
