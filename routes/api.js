/*******************************************
*
* 桥接层(业务逻辑层)：
* 连接路由层 + 数据库操作层
*
********************************************/
const { v4: uuid } = require('uuid');
const file = require('../utils/file.js');
const common = require('../utils/common.js');
const mongodb = require('../utils/mongodb.js');

/**
 * get authors.
 * @param {String} id(req.query.id)
 * @return {Object} article
 */
module.exports.authors_get = (req, res, next) => {
  let queryOptions = {};
  if(req.query && req.query.id) {
    queryOptions.id = req.query.id;
  }

  mongodb.authors_get(queryOptions)
    .then(result => res.json({
      errCode: 0,
      errMessage: 'success',
      result
    }))
    .catch(err => res.json(err))
}

/**
 * create or update article.
 * 1.（作者schema中）需要根据路径，创建在对应的位置
 * 2. (文章scehma中) 保存文章详情（无path)
 * @param {Object} article(req.body)
 * @return {Object} article(created or updated)
 */
module.exports.article_post = (req, res, next) => {
  req.body.updateTime = common.formatTime(new Date());
  if( req.body && req.body.id ) {
    mongodb.article_update(req.body)
      .then(result => res.json({
        errCode: 0,
        errMessage: 'success',
        result
      }))
      .catch(err => res.json(err))
  } else {
    req.body.id = uuid();
    req.body.updateTime = common.formatTime(new Date());

    mongodb.article_create(req.body)
      .then(result => res.json({
        errCode: 0,
        errMessage: 'success',
        result
      }))
      .catch(err => res.json(err))
  }
}

/**
 * create or update path.
 * “我的”中路径创建、更新
 * @param {Object} article(req.body)
 * @return {Object} article(created or updated)
 */
module.exports.path_post = (req, res, next) => {
  if( req.body && req.body.id ) {
    mongodb.path_update(req.body)
      .then(result => res.json({
        errCode: 0,
        errMessage: 'success',
        result
      }))
      .catch(err => res.json(err))
  } else {
    req.body.data.id = uuid();
    req.body.children = req.body.children || [];

    mongodb.path_create(req.body)
      .then(result => res.json({
        errCode: 0,
        errMessage: 'success',
        result
      }))
      .catch(err => res.json(err))
  }
}

/**
 * get article by id.
 * @param {String} id(req.query.id)
 * @return {Object} article
 */
module.exports.article_get = (req, res, next) => {
  mongodb.article_get(req.query.id)
    .then(result => res.json({
      errCode: 0,
      errMessage: 'success',
      result
    }))
    .catch(err => res.json(err))
}

/**
 * delete article by id.
 * @param {String} id(req.query.id)
 * @return {Object} article
 */
module.exports.article_delete = (req, res, next) => {
  console.log(req.body);
  mongodb.article_delete(req.body)
    .then(result => res.json({
      errCode: 0,
      errMessage: 'success',
      result
    }))
    .catch(err => res.json(err))
}

/**
 * get filtered articles.
 * @param {Object} filterOption(req.body)
 * @return {Object} article(created or updated)
 */
module.exports.articles_get = (req, res, next) => {
  //支持以 '' 或 | 或 ',' 或 '，'分隔的字符串
  if(req.query.keywords) {
    req.query.keywords = req.query.keywords.split(/['|', ' ', ',', '，']/);
  }
  mongodb.articles_get(req.query)
    .then(result => {
      res.json({
        errCode: 0,
        errMessage: 'success',
        result: {
          list: result.list,
          total: result.total
        }
      })
    })
    .catch(err => res.json(err))
}

/**
 * save the image.
 * @param {Object} image(req)
 * @return {String} imageUrl
 */
module.exports.uploadImage = function(req, res, next) {
  file.saveFile(req)
      .then(result => res.json({
        errCode: 0,
        errMessage: 'success',
        result
      }))
    .catch(err => res.json(err))
}

/**
 * search the author.
 * @param {string} id
 * @param {string} password
 * @return {Object} authorModel 
 */

// module.exports.author_get = function(req, res, next) {
//   mongodb.author_get(req.query.id, req.query.password)
//     .then(result => {
//       res.json({
//         errCode: 0,
//         errMessage: 'success',
//         result
//       })
//     })
//     .catch(err => res.json(err))
// }


/**
 * 查询部门详情.
 * @param {string} id
 * @return {Object} departmentModel
 */
module.exports.department_get = function(req, res, next) {
  mongodb.department_get(req.query.id)
    .then(result => res.json({
      errCode: 0,
      errMessage: 'success',
      result      
    }))
    .catch(err => res.json(err))
}

/**
 * 保存/更新部门详情.
 * @param {Object} departmenModel
 * @return {Object} departmentModel
 */
module.exports.department_post = function(req, res, next) {
  if(req.body && req.body.id) {
    mongodb.department_update(req.body)
      .then(result => res.json({
        errCode: 0,
        errMessage: 'success',
        result
      }))
      .catch(err => res.json(err))
  } else {
    req.body.id = uuid();
    mongodb.department_create(req.body)
      .then(result => res.json({
        errCode: 0,
        errMessage: 'success',
        result      
      }))
      .catch(err => res.json(err))    
  }
}

/**
 * 删除部门详情.
 * @param {string} id
 * @return {Object} departmentModel
 */
module.exports.department_delete = function(req, res, next) {
  mongodb.department_delete(req.body)
    .then(result => {
      if(result.deletedCount === 0) {
        res.json({
          errCode: -1,
          errMessage: 'no this department',
          result
        })
      } else {
        res.json({
          errCode: 0,
          errMessage: 'success',
          result
        })        
      }
    })
    .catch(err => res.json(err))
}


/**
 * get stars.
 * @param {String} id(req.query.id)
 * @return {Object} article
 */
module.exports.stars_get = (req, res, next) => {
  mongodb.stars_get(req.query.id)
    .then(result => res.json({
      errCode: 0,
      errMessage: 'success',
      result
    }))
    .catch(err => res.json(err))
}

/**
 * post star.
 * @param {String} id(req.query.id)
 * @return {Object} article
 */
module.exports.star_post = (req, res, next) => {
  mongodb.star_post(req.body.id, req.body.articleId)
    .then(result => res.json({
      errCode: 0,
      errMessage: 'success',
      result
    }))
    .catch(err => res.json(err))
}

/**
 * delete star.
 * @param {String} id(req.query.id)
 * @return {Object} article
 */
module.exports.star_delete = (req, res, next) => {
  mongodb.star_delete(req.body.id, req.body.articleId)
    .then(result => res.json({
      errCode: 0,
      errMessage: 'success',
      result
    }))
    .catch(err => res.json(err))
}

/**
 * get my.
 * @param {String} id(req.query.id)
 * @return {Object} article
 */
module.exports.my_get = (req, res, next) => {
  mongodb.my_get(req.query.id)
    .then(result => res.json({
      errCode: 0,
      errMessage: 'success',
      result
    }))
    .catch(err => res.json(err))
}

/**
 * post my.（略）
 * 修改接口: post /article。并代替post /my。
 * @param {String} id(req.query.id)
 * @return {Object} article
 */

/**
 * get my.
 * @param {String} id(req.query.id)
 * @return {Object} article
 */
module.exports.path_get = (req, res, next) => {
  mongodb.path_get(req.query.author)
    .then(result => res.json({
      errCode: 0,
      errMessage: 'success',
      result
    }))
    .catch(err => res.json(err))
}

module.exports.path_delete = (req, res, next) => {
  mongodb.path_delete(req.body)
    .then(result => res.json({
      errCode: 0,
      errMessage: 'success',
      result
    }))
    .catch(err => res.json(err))
}
