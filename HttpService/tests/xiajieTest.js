var test = require('./baseTest');
function xiajie(){
}
xiajie.prototype = new test(); //建立原型链

var xiajie = new xiajie();

xiajie.POST('/api-xiajie/homeProductList', {});
xiajie.POST('/api-xiajie/getProductClassify', {parentId:-1});
xiajie.POST('/api-xiajie/getProductClassify', {});
