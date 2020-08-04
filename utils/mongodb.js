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

// module.exports.articles_get = option => {
//   console.log(option);
//   //此处根据规则，指定在数据库高效搜索的具体方式
//   return new Promise((resolve, reject) => {
//     ArticleModel
//       .find()
//       .then(res => resolve(res))
//       .catch(err => reject(err));
//   })
// }


module.exports.articles_get = options => {

  // let options = {
  //   keywords: ['文章内容', '更改', 'C'], //'A | B | C'
  //   author: '124',
  //   categories: ['新人', '开发'],
  //   state: 'edit',
  //   path: ['0-1']
  // }

  // let options = {
  //   keywords: ['文章内容', '更改', 'C'] //'A | B | C'

  // }

  let result1 = {
    $and: [
      { author: options.author}, 
      { categories: { $in: options.categories }},
      { state: options.state },
      { path: { $in: options.path }}
    ]
  }

  let regex = options.keywords.join("|");

// //且
//   let result2 = {
//     $or: [
//       // { author: { $and: options.keywords } },
//       { tags: { $and: ['文章内容', '更改'] } },

//       // { content: { $regex: regex } },
//       // { abstract: { $regex: regex } },
//       // { content: { $regex: regex } },
//       // { name: { $regex: regex } }
//     ]
//   }

//或
  let result2 = {
    $or: [
      { author: { $in: options.keywords } },
      { tags: { $in: options.keywords } },

      { content: { $regex: regex } },
      { abstract: { $regex: regex } },
      { content: { $regex: regex } },
      { name: { $regex: regex } }
    ]
  }


  //此处根据规则，指定在数据库高效搜索的具体方式
  return new Promise((resolve, reject) => {
    ArticleModel
      .find(result1)
      .find(result2)
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