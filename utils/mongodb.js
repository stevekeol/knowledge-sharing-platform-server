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

// const db = mongoose.connection;
// db.userHelp.ensureIndex({'location': '2d'})


module.exports.article_post = article => {
  return new Promise((resolve, reject) => {
    new ArticleModel(article)
      .save()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.article_get = id => {
  return new Promise((resolve, reject) => {
    ArticleModel
      .find({ 'id': id }, { _id: 0 })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.articles_get = option => {
  return new Promise((resolve, reject) => {
    ArticleModel
      // .find({ $text: { $search: option.content } })
      find()
      .then((res) => resolve(res))
      .catch((err) => reject(err));      
  })
}



//bug
module.exports.updateUserHelp = function(query, updatedInfo) {
  console.log(query);
  console.log(updatedInfo);
  return new Promise((resolve, reject) => {
    userHelpModel
      .findOneAndUpdate(query, updatedInfo)
      .then((res) => {
        console.log(res);
        resolve(res)})
      .catch((err) => reject(err));
  })
}

//??
module.exports.getNearbyHelps = function(center, distance, limit) {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find({location:{"$near": center, $maxDistance: distance}}).limit(limit)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}


module.exports.getRecentHelps = function(openid) {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find({'openid': openid})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.postFeedback = function(feedback) {
  return new Promise((resolve, reject) => {
    feedbackModel
      .save(feedback)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getFeedback = function(openid) {
  return new Promise((resolve, reject) => {
    feedbackModel
      .find({'openid': openid})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getBlock = function(height) {
  return new Promise((resolve, reject) => {
    blockModel
      .find({'height': height}, {_id:0})
      .then((res) => resolve(res[0])) //取第一个元素，即将该对象从数组中取出来
      .catch((err) => reject(err));
  })
}