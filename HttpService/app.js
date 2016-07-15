var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/routes');
var weixin = require('./routes/weixin');

//请求数据解析中间件
var myParser = require('./middleware/mybodyParser');
var app = express();
process.app = app;
var logger = process.logger;


// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/*
  添加中间件,解析加密数据, 根据http hend 的encrypt自动判断请求数据是否加密
 */
app.use(myParser());
app.use(cookieParser());
app.use('/api-main', routes);
app.use('/api-weixin', weixin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//
module.exports = app;
