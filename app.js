/***************************************************
 *
 * 该版本仅适用于sharing@bnqkl，不适用于webApp(不提供html页面)
 *
 ****************************************************/
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes/index');


//中间件:格式化打印api时间戳
var common = require('./utils/common.js');
const logDate = (req, res, next) => {
  if(`${req.url.split('?')[0]}` != '/favicon.ico'){
    console.log(`【${common.formatTime(new Date())}】: ${req.method} ${req.url.split('?')[0]}`);
  }
  next();
}

//中间件:处理错误请求
const handlerErr = (req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  res.end('404:This server is just for sharing@bnqkl.');
}

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logDate); //打印api的时间戳
app.use('/', routes);
app.use(handlerErr);

module.exports = app;

