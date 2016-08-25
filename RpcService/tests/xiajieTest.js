/**
 * Created by Moqizhan on 16/8/25.
 */
var confige = require('./../configes/confige');
var rpc = require('../rpc-controllers/rpc-server');


rpc.callXiaJServer(function(remote) {
    remote.homeProductList(function (err, data) {
        console.log('个人中心授权页面: ' + JSON.stringify(data));
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxebf2d76f972c42cf&redirect_uri=http%3A%2F%2F192.168.0.192%3A3000%2Fusers%2FpageAuthorize&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect

    });
});