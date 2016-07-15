/**
 * Created by niupark on 16/3/18.
 */
/*
 * */
'use strict';
const logger = process.logger;
const jssdk = require('node-weixin-jssdk');

const settings = require('node-weixin-settings');

const oauth = require('node-weixin-oauth');
const wxauth = require('node-weixin-auth');

const settting =require('./weixinSetting');

let user = require("../DB/userDB");

//const
/*
 微信公众号开发验证接口
 */

/*测试公众号
 *appID
 wxebf2d76f972c42cf
 appsecret
 016be2b559c914a9ae1e28e9b6788c90
 * */

//let wechatApp = new wechat.WechatApp('wxebf2d76f972c42cf', '016be2b559c914a9ae1e28e9b6788c90',logger);
/*
 {
 "button": [
 {
 "name": "物业",
 "sub_button": [
 {
 "type": "view",
 "name": "现网环境",
 "url": "http://www.uscreen.online/users/accessSysHome.html"
 },
 {
 "type": "view",
 "name": "本地环境",
 "url": "http://192.168.0.192:8080/users/accessSysHome.html"
 }
 ]
 }
 ]
 }*/
function  createMenu(){
    let menu = new wechat.MenuParam();
    let button = menu.addButton();
    button.type = wechat.BUTTON_STYLE_VIEW;
    button.name = '通行证';
    button.key ='KEY_SAY_1';
    button.url = 'https://www.baidu.com';


    wechatApp.createMenu(menu,function(e, data){
        if (!e){
            logger.info(data);
        }else{
            logger.info(e);
        }
    })

}
function  deleteMenue(){
    wechatApp.deleteMenu(function(e, data){
        if (!e){
            logger.info(data);
        }else{
            logger.info(e);
        }
    })
}
/*
 *获取 jsapi_ticket
 * 返回jssdk调用的初始化参数
 * @paramer app = {
 id:
 secret:
 };
 @url :
 */
function ready(app, url, cb){
    try{
        jssdk.prepare({id:app.appid,secret:app.secret}, url, function(e, ticket){
            if(e){
                logger.error('获取jsapi_ticket失败');
                cb(true);
            }else{
                logger.info(ticket);
                cb(false, ticket);
            }

        });
    }catch (e){
        cb(true);
    }

}

/*
 * 公众号页面请求授权接口
 * */

function getPageAuthorize(app, url, state, cb){
    //  createURL: function (appId, redirectUri, state, scope, type) {
    try {
        logger.info('授权页面:' + url);
        let oauthUrl =  oauth.createURL(app.appid, url, state, 1, 0);
        typeof cb === 'function' && cb(false, oauthUrl);
    }catch (e){
        logger.error(e);
        typeof cb === 'function' && cb(true);
    }

}
/*
 * 公众号获取授权
 * */
function accessToken(app, cb) {
    try {
        var _app ={};
        _app.id = app.appid;
        _app.secret = app.secret;
        logger.info('公众号'+JSON.stringify(app)+'获取凭证:');
        wxauth.determine(settting,_app,function () {
            settings.get(app.appid, "auth", function (authData) {
                typeof cb === 'function' && cb(false, authData.accessToken);
            });
        });
    }catch (e){
        logger.error(e);
        typeof cb === 'function' && cb(true);
    }
}
/*
 * 公众号code  置换openid
 * code只能置换一次openid
 * 直接返回openid string
 * */
function weixinOpenid(app, code ,cb) {
    try {
        oauth.success({id: app.appid, secret: app.secret}, code, function (e, data) {
            if (e) {
                logger.info('获取用户信息失败,code可能失效');
                logger.error(data);
                typeof cb === 'function' && cb(true, -1);
            } else {
                //获取用户信息,保存数据库
                oauth.profile(data.openid, data.access_token, function (e, data) {
                    //取回用户信息
                    if (!e) {
                        //保存数据库
                        logger.info('获取微信用户信息成功:' + JSON.stringify(data));
                        user.AddPersonalInfo (data.openid, data).then((result) =>
                        {
                            if (result !== 1){
                                logger.error("[Error] user AddPersonalInfo Error code:" + result);
                            }
                        });
                    } else {
                        logger.error(data);
                    }
                    //无论什么情况, 返回openid
                    typeof cb === 'function' && cb(false, data.openid);

                });
            }
        });
    }catch (e){
        logger.error(e);
        typeof cb === 'function' && cb(true);
    }
}
/*
*获取用户的微信基本信息
* 返回对象
* {
 "openid":" OPENID",
 " nickname": NICKNAME,
 "sex":"1",
 "province":"PROVINCE"
 "city":"CITY",
 "country":"COUNTRY",
 "headimgurl":    "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
 "privilege":[
 "PRIVILEGE1"
 "PRIVILEGE2"
 ],
 "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
 }
* */
function weixinUser(openid ,cb) {
    try {
        //获取用户基本信息
        user.GetPersonalInfo (openid).then((info) => {
            console.log("Get opneid " + openid + ", info is " + info);
            // 有可能为空
            typeof cb === 'function' && cb(false, info);

        });
    } catch (e) {
        logger.error(e);
        typeof cb === 'function' && cb(true);
    }
}


exports.jssdkReady = ready;
exports.getPageAuthorize = getPageAuthorize;
exports.weixinUser = weixinUser;
exports.weixinOpenid = weixinOpenid
exports.createMenu =createMenu;
exports.deleteMenue =deleteMenue;
exports.accessToken =accessToken;