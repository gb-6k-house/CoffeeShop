/**
 * Created by niupark on 16/7/12.
 */
var test = require('./baseTest');
function weixin(){
}
weixin.prototype = new test(); //建立原型链

var weixinTest = new weixin();

weixinTest.POST('/api-weixin/userInfo', {"openid":"oOk16wG870CmTk3IML1aNjRnSmkk"});
