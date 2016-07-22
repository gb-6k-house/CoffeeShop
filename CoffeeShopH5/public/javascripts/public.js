function getServiceUrl(){
    return 'http://192.168.0.192:3001';
    //return 'http://www.uscreen.online:3000';
}

function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return (prePath + postPath);
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

/* 
 02.功能：保存cookies函数  
 03.参数：name，cookie名字；value，值 
 04.*/
function SetCookie(name,value){
        var Days = 30*12;   //cookie 将被保存一年  
        var exp  = new Date();  //获得当前时间  
        exp.setTime(exp.getTime() + Days*24*60*60*1000);  //换成毫秒  
       document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
/* 
 12.功能：获取cookies函数  
 13.参数：name，cookie名字 
 14.*/
function getCookie(name){
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null){
             return unescape(arr[2]);
            }else{
             return null;
            }
    }
/* 
 24.功能：删除cookies函数  
 25.参数：name，cookie名字 
 26.*/

function delCookie(name){
        var exp = new Date();  //当前时间  
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }  
