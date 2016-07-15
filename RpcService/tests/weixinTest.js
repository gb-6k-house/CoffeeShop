/**
 * Created by niupark on 16/7/11.
 */
var confige = require('./../configes/confige');
var rpc = require('../rpc-controllers/rpc-server');
var db = require('ssdb');
var wxApp = {
    appid: 'wxebf2d76f972c42cf',
    secret: '016be2b559c914a9ae1e28e9b6788c90'
}
var ssdb ={
    host:'www.uscreen.online',
    port:8888
};
rpc.callWX(function(remote) {
    remote.getPageAuthorize(wxApp,'http://192.168.0.192:3000/users/pageAuthorize' ,'1',function(err, data){
        console.log('个人中心授权页面: '+ data);
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxebf2d76f972c42cf&redirect_uri=http%3A%2F%2F192.168.0.192%3A3000%2Fusers%2FpageAuthorize&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect

    });
    remote.getPageAuthorize(wxApp,'http://192.168.0.169:3000/users/pageAuthorize' ,'1',function(err, data){
        console.log('个人中心授权页面: '+ data);
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxebf2d76f972c42cf&redirect_uri=http%3A%2F%2F192.168.0.192%3A3000%2Fusers%2FpageAuthorize&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect

    });
    remote.getPageAuthorize(wxApp,'http://192.168.0.192:3000/users/pageAuthorize' ,'2',function(err, data){
        console.log('首页授权页面: '+ data);

    });
    remote.getPageAuthorize(wxApp,'http://192.168.0.169:3000/users/pageAuthorize' ,'2',function(err, data){
        console.log('首页授权页面: '+ data);

    });
    remote.getPageAuthorize(wxApp,'http://www.uscreen.online/users/pageAuthorize' ,'2',function(err, data){
        console.log('首页授权页面: '+ data);

    });
    remote.accessToken(wxApp, function(err, data){
        console.log('accessToken: '+ data);

    });
});
// var pool = db.createPool(ssdb);
// pool.acquire().set('system_name', 'Coffeeshop');
// pool.acquire().set('system_name1', 'Coffeeshop1');