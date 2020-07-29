/*******************************************
*
* 桥接层：连接路由层 + 数据库操作层
*
********************************************/
const { v4: uuid } = require('uuid');
const file = require('../utils/file.js');
const common = require('../utils/common.js');
const mongodb = require('../utils/mongodb.js');

/**
 * create or update article.
 * @param {Object} article(req.body)
 * @return {Object} article(created or updated)
 */
module.exports.article_post = (req, res, next) => {
  req.body.updateTime = common.formatTime(new Date());
  if( req.body && req.body.id ) {
    mongodb.article_update(req.body)
      .then(result => res.json(result));  
  } else {
    req.body.id = uuid();
    req.body.updateTime = common.formatTime(new Date());

    mongodb.article_create(req.body)
      .then(result => res.json(result));
  }
}

/**
 * get article by id.
 * @param {String} id(req.query.id)
 * @return {Object} article
 */
module.exports.article_get = (req, res, next) => {
  console.log(req.user);
  mongodb.article_get(req.query.id)
    .then(result => res.json(result));
}

/**
 * get filtered articles.
 * @param {Object} filterOption(req.body)
 * @return {Object} article(created or updated)
 */
module.exports.articles_get = (req, res, next) => {
  console.log(req.query);
  mongodb.articles_get(req.query)
    .then(result => res.json(result));
}

/**
 * save the image.
 * @param {Object} image(req)
 * @return {String} imageUrl
 */
module.exports.uploadImage = function(req, res, next) {
  file.saveFile(req)
    .then(result => res.json(result))
    .catch(err => res.json(err))
}
