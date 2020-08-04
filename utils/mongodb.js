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


//尚有优化空间
module.exports.articles_get = options => {

  function help1(opt) {
    let result = {
      $and: []
    };

    for(let key in opt) {
      if(key === 'author') {
        result.$and.push({ author: opt.author})
      }
      if(key === 'categories') {
        result.$and.push({ categories: { $in: opt.categories }})
      }
      if(key === 'state') {
        result.$and.push({ state: opt.state})
      }
      if(key === 'path') {
        result.$and.push({ path: opt.path})
      }                  
    }
    if(!result.$and.length) {
      delete result.$and;
    }
    return result;
  }

  function help2(opt) {
    if(!opt.keywords) {
      return {};
    }

    let regex;
    if(opt.keywords && opt.keywords.length) {
      regex = opt.keywords.join("|");
    } else {
      regex = new RegExp(/[.\n]*/)
    }

    let result2 = {
      $or: [
        { author: { $in: opt.keywords } },
        { tags: { $in: opt.keywords } },

        { content: { $regex: regex } },
        { abstract: { $regex: regex } },
        { content: { $regex: regex } },
        { name: { $regex: regex } }
      ]
    }
    return result2;
  }

  //此处根据规则，指定在数据库高效搜索的具体方式
  return new Promise((resolve, reject) => {
    ArticleModel
      .find(help1(options))
      .find(help2(options))
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