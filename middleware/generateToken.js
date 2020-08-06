/*************************************
 * JWT-Auth middleware.
 * Author: zhangjie
 * CreateTime: 2020-07-29 15:30
 *************************************/

const jwtExpress = require('express-jwt');
const jwt = require('jsonwebtoken');
const mongodb = require('../utils/mongodb.js');
const secrect = 'BFChainer'; //私盐

/**
 * generate the token by jwt.
 * @param {Object} id & password
 * @return {String} token
 */
const generateToken = async (req, res, next) => {
  try {
    let result = await mongodb.author_get(req.query.id, req.query.password);

    const token = jwt.sign({
      id: result.id,
      name: result.name
    },
    'BFChainer',
    {
      expiresIn: 3600 * 24 * 30
    });

    //在header中添加jwt授权的token
    res.setHeader('Authorization', token);

    //此处直接返回给客户端，不再经过后续中间件
    res.json({ 
      errCode: 0,
      errMessage: 'success',
      result
    });
  } catch(err) {
    res.json(err);
  }
}

module.exports = generateToken;