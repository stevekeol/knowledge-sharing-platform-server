/***************************************************
 *
 * 该版本仅适用于sharing@bnqkl，不适用于webApp(不提供html页面)
 *
 ****************************************************/
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
const cors = require('cors'); //真实效果待验证


//中间件:格式化打印api时间戳
var common = require('./utils/common.js');
const logDate = (req, res, next) => {
  if(`${req.url.split('?')[0]}` != '/favicon.ico'){
    console.log(`【${common.formatTime(new Date())}】: ${req.method} ${req.url.split('?')[0]}`);
  }
  next();
}

// // //解决跨域问题(有了cors模块，就先不用)
// const cors =  (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

//   if (req.method == 'OPTIONS') {
//     res.send(200); //让options请求快速返回
//   }
//   else {
//     next();
//   }
// }

//中间件:处理错误请求
const handlerErr = (req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  res.end('404:This server is just for sharing@bnqkl.');
}


var app = express();
app.use(cors()); //待测试是否可取消
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logDate); //打印api的时间戳
// app.use(cors);
app.use(express.static('public')); //这样就可以直接访问静态文件，而无需路由做过多处理
app.use('/', routes);
app.use(handlerErr);

module.exports = app;

