/*************************************
 * JWT-Auth middleware.
 * Author: zhangjie
 * CreateTime: 2020-07-29 15:30
 *************************************/

const jwtExpress = require('express-jwt');
const jwt = require('jsonwebtoken');
const secrect = 'BFChainer'; //私盐

//express-jwt中间件帮我们自动做了token的验证以及错误处理(payload默认挂载在req.user上)
const verifyToken = jwtExpress({secret: secrect, algorithms: ['HS256']}); 

module.exports = verifyToken;