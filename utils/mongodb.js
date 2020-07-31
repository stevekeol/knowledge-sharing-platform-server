/*******************************************
*
* 数据库操作层
*
********************************************/
const mongoose = require('mongoose');
const models = require('./models.js');
const config = require('./config.js');

//数据库连接
mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true });


const ArticleModel = mongoose.model('article', models.getSchema('article'));
const AuthorModel = mongoose.model('author', models.getSchema('author'));


module.exports.article_create = article => {
  return new Promise((resolve, reject) => {
    new ArticleModel(article)
      .save()
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

module.exports.article_update = article => {
  return new Promise((resolve, reject) => {
    ArticleModel
      .findOneAndUpdate({ 'id': article.id }, article)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}


module.exports.article_get = id => {
  return new Promise((resolve, reject) => {
    ArticleModel
      .find({ 'id': id })
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err))
  })
}

module.exports.articles_get = option => {
  return new Promise((resolve, reject) => {
    ArticleModel
      .find()
      .then(res => resolve(res))
      .catch(err => reject(err));
  })
}

module.exports.author_auth_get = author => {
  return new Promise((resolve, reject) => {
    AuthorModel
      .findOne({ "id": author.id }, { "_id": 0, "articles": 0 })
      .then(res => {
        if( res.pw === author.pw ) {
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch(err => reject(err));
  })
}