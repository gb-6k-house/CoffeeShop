/**
 * Created by niupark on 16/7/8.
 */

const rpc = require('./rpc-server');
const confige = require('../configes/confige');
const logger = process.logger;
var x2j = require('xml2js');

//该页面由微信授权之后回调
exports.pageAuthorize = function(req, res,next) {
    logger.info(req.url + '授权页面回调');
    if(!req.query.code){
        logger.info('用户授权失败..!');
        res.send('服务器错误,请重试!');
    }else {
        rpc.callWX(function(remote) {
            remote.weixinOpenid(confige.wxPublic,req.query.code, function(err, openid){
                if (err) {
                    res.send('服务器错误,请重试!');
                }else{
                    //session中保存openid
                    //res.cookie('openid', openid);
                    if (req.query.state === "1"){
                        res.redirect("/users/my"+'?openid='+openid);

                    } else if (req.query.state === "2"){
                        res.redirect("/index"+'?openid='+openid);

                    }else if (req.query.state === "3"){
                        res.redirect("/vote"+'?openid='+openid)

                    }else{
                        res.send('服务器错误,请重试!');
                    }

                    /*if (req.query.state === "1"){
                        res.redirect("/users/my");

                    } else if (req.query.state === "2"){
                        res.redirect("/");

                    }else if (req.query.state === "3"){
                        res.redirect("/vote")

                    }else{
                        res.send('服务器错误,请重试!');
                    }*/

                }
            });
        });

    }
}
exports.handleMsg = function(req, res, next) {
    x2j.parseString(req.body, {
        explicitArray: false,
        ignoreAttrs: true
    }, function(error, json) {
        if (error) {
            logger.error('解析微信公众消息出错!');
            res.send('');
            return;
        }
        var args = json.xml;
        logger.info('收到公众发来的消息' + JSON.stringify(args));

        rpc.callCoffeShop(function(remote) {
            remote.handelWeixinMsg(args, function (data) {
                (function (res) {
                    logger.info('回复用户消息' + JSON.stringify(data));
                    res.send(data);
                })(res);

            });
        });
    });
}
exports.vetify = function(req, res,next) {
    logger.info('收到消息验证请求');
    res.send(req.query.echostr);
}
