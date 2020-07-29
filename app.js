/****************************************************
 *
 * 注:提供动态请求服务(knowledge-sharing-platform@bnqkl)
 *
 ****************************************************/
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const cors = require('cors'); //跨域中间件，真实效果待验证

const logDate = require('./middleware/logDate.js');
const defaultError = require('./middleware/defaultError.js');


const app = express();
app.use(cors()); //待测试是否可取消
app.use(logDate); //打印api的时间戳
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); //这样就可以直接访问静态文件，而无需路由做过多处理
app.use('/', routes);
app.use(defaultError);

module.exports = app;