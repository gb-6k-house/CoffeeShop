/**
 * Created by niupark on 16/2/19.
 */
/*
  @by liukai
  主要定义rpc服务提供的接口
* */
/**
 * 所有RPC 接口的参数形式为api(..callback), callback参数形式为callback(error,...);
 */
var confige = require('../configes/confige');
var mainRpc = require('../rpc-controllers/mainRpc');
var weixinRpc = require('../rpc-controllers/weixinPublicRpc');
var coffeShopRpc = require('../rpc-controllers/CoffeeShopRpc');
var xiajieRpc = require('../rpc-controllers/xiajieRpc');

var DNode = require('dnode');
function onError(error) {
    console.log('DNode error', JSON.stringify(error));
}


exports.start = function(){
    //rpc 发布接口
    var server = DNode({
        rpcMain:mainRpc.main
    }).listen(confige.rpchost.port);

    server.on('error', onError);

    //rpc 发布接口
    var wxserver = DNode({
        accessToken:weixinRpc.accessToken,
        weixinUser:weixinRpc.weixinUser,
        getPageAuthorize:weixinRpc.getPageAuthorize,
        weixinOpenid:weixinRpc.weixinOpenid
    }).listen(confige.wxrpchost.port);

    wxserver.on('error', onError);

    //rpc 发布接口
    var coffeShopserver = DNode({
        handelWeixinMsg:coffeShopRpc.handelWeixinMsg
    }).listen(confige.coffeeShopchost.port);

    coffeShopserver.on('error', onError);

    //rpc 发布接口
    var xiajieServer = DNode({
        homeProductList:xiajieRpc.homeProductList,
        getProductClassify:xiajieRpc.productClassify
    }).listen(confige.xiajiehost.port);

    xiajieServer.on('error', onError);

}
