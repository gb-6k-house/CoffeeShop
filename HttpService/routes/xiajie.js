/**
 * Created by Moqizhan on 16/8/25.
 */
var xiajiehttp = require('../http-controllers/xiajieHttp');
var express = require('express');
var router = express.Router();
router.post('/homeProductList', xiajiehttp.homeProductList);
router.get('/homeProductList', xiajiehttp.homeProductList);
router.post('/getProductClassify', xiajiehttp.getProductClassify);


module.exports = router;