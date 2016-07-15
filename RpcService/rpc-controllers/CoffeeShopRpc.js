/**
 * Created by niupark on 16/7/14.
 */
const logger = process.logger;
const messages = require('node-weixin-message').messages;
var reply =require('node-weixin-message').reply;

function onText(message, cb) {
    var text = reply.text(message.ToUserName, message.FromUserName, '您好! 这里是木柚咖啡.');
    logger.info('回复用户消息 :' + JSON.stringify(text));
    typeof cb === 'function' && cb(text);
}

function subscreib(message, cb) {
    logger.info('收到用户定义消息 :' + JSON.stringify(message));
    var text = reply.text(message.ToUserName, message.FromUserName, '感谢关注,这里木柚咖啡特意为您准备更多优惠，一起来享受咖啡相伴的慢时光^_^');
    logger.info('回复用户消息 :' + JSON.stringify(text));
    typeof cb === 'function' && cb(text);
}
function unsubscribe(message, cb) {
    typeof cb === 'function' && cb('');
}

//处理扫描带参数二维码事件
function scan(message, cb) {
    typeof cb === 'function' && cb('');
};

//处理上报地理位置事件
function location(message,cb ) {
    typeof cb === 'function' && cb('');

}
//处理点击菜单拉取消息时的事件
function OnClick (message,cb) {
    if (message.EventKey == "my_center") {

        var text = reply.text(message.ToUserName, message.FromUserName, '木柚咖啡正为你准备会员大礼包呢🎁🎁🎁\n👯欢迎您到时参与，享有更多超值优惠！');
        logger.info('回复用户消息 :' + JSON.stringify(text));
        typeof cb === 'function' && cb(text);

    }
    else if (message.EventKey == "my_party") {
        var text = reply.text(message.ToUserName, message.FromUserName, '老板娘正在为爱生活的你加油布置，千万不要错过哦！');
        logger.info('回复用户消息 :' + JSON.stringify(text));
        typeof cb === 'function' && cb(text);
    }
    else if (message.EvenKey = "my_wifi") {
        var text = reply.text(message.ToUserName, message.FromUserName, '账号 / Account：Mooucoffee\n密码 / Password：mooucoffee');
        logger.info('回复用户消息 :' + JSON.stringify(text));
        typeof cb === 'function' && cb(text);
    }else{
        typeof cb === 'function' && cb('');

    }
}

//处理点击菜单跳转链接时的事件
function onView (message,cb) {
}

//处理模块消息发送事件
function onTemplatesendjobfinish(message,cb) {
}

exports.handelWeixinMsg = function(weixinmsg, cb) {
    messages.on.text(OnText);
//处理用户订阅
    messages.event.on.subscribe(subscreib);
//处理用户退订
    messages.event.on.unsubscribe(unsubscribe);

//处理扫描带参数二维码事件
    messages.event.on.scan(scan);

//处理上报地理位置事件
    messages.event.on.location(location);

//处理点击菜单拉取消息时的事件
    messages.event.on.click(onText);

//处理点击菜单跳转链接时的事件
    messages.event.on.view(onView);

//处理模块消息发送事件
    messages.event.on.templatesendjobfinish(onTemplatesendjobfinish);
    logger.info('收到微信消息 :' + JSON.stringify(weixinmsg));
    messages.parse(weixinmsg, cb);
}

