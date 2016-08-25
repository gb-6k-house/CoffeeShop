/**
 * Created by niupark on 16/1/8.
 */
//require('util').inherits(home,require('./baseTest').base);
var test = require('./baseTest');
function home(){
}
home.prototype = new test(); //建立原型链

var homeTest = new home();

homeTest.POST('/api-main/hello', {location:{longitude:0.0, latitude:0.0}, IMEI:'868942028136517'});


