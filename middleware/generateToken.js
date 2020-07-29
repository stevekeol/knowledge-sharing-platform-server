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
    let result = await mongodb.author_auth_get(req.body);

    const token = jwt.sign({
      id: result.id,
      name: result.name,
      departments: result.departments
    },
    'BFChainer',
    {
      expiresIn: 3600 * 24 * 30
    });

    res.setHeader('Authorization', token);

    res.json({ 
      errCode: 0,
      errMessage: 'Token has been added in Headers'
    });
  } catch {
    res.json({ 
      errCode: -1,
      errMessage: 'ID or password is invalid'
    });
  }
}

module.exports = generateToken;