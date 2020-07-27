/*******************************************
*
* 桥接层：连接路由层 + 数据库操作层
*
********************************************/
const fs = require('fs');
const file = require('../utils/file.js');
const common = require('../utils/common.js');
const mongodb = require('../utils/mongodb.js');
const { v4: uuid } = require('uuid');


module.exports.article_post = (req, res, next) => {
  console.log(req.body);
  req.body.createTime = common.formatTime(new Date());
  req.body.updateTime = common.formatTime(new Date());
  req.body.id = uuid();

  mongodb.article_post(req.body)
    .then(result => res.json(result));
}

module.exports.article_get = (req, res, next) => {
  console.log(req.query);
  mongodb.article_get(req.query.id)
    .then(result => res.json(result));
}

module.exports.articles_get = (req, res, next) => {
  console.log(req.query);
  mongodb.articles_get(req.query)
    .then(result => res.json(result));
}



//上传图片的保存
module.exports.uploadImage = function(req, res, next) {
  file.saveFile(req)
    .then(result => res.json(result))
    .catch(err => res.json(err))
}