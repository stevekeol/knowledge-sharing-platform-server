/*******************************************
*
* 数据库操作层
*
********************************************/
const { ArticleModel, AuthorModel, DepartmentModel } = require('./models.js');
const mongoBridge = require('./mongoBridge.js');



/*******************************
 *
 * path:
 * {
 *   author: "124",
 *   path: ["article"], //至少有一个元素
 *   id?: "id0",
 *   data: {}
 * }
 *
 * *******************************/
module.exports.path_create = path => {
  let options = mongoBridge.transPathCreateOption(path.path);
  
  if(!path.path.length) {
    //是否有更好的异常处理
    console.info('path.length is 0 in /path_create.');
  }

  return new Promise((resolve, reject) => {
    AuthorModel
      .findOneAndUpdate(
        { id: path.author},
        { '$push': { [options.position]: path.data }},
        { arrayFilters: options.arrayFilters, //深层次查询的样子
          new: true
        }
      )
      .then(res => resolve(res.articles))
      .catch(err => {
        console.log(err)
        reject(err)
      });
  })
}

/*******************************
 *
 * path:
 * {
 *   author: "124",
 *   path?: ["article"], //可以为空，则表示直接更改该作者的articles字段
 *   id?: "id0",
 *   data: {}/[]
 * }
 *
 * *******************************/
module.exports.path_update = path => {
  console.log(path);
  return new Promise((resolve, reject) => {
    AuthorModel
      .findOne(
        { id: path.author }
      )
      .then(pathTree => {
        let options = mongoBridge.transPathUpdateOption(pathTree.articles, path);
        AuthorModel
          .findOneAndUpdate(
            { id: path.author},
            { '$set': { [options.position]: options.pathTree } },
            { 
              arrayFilters: options.arrayFilters,
              new: true
            }
          )
          .then(res => {
            resolve(res.articles)
          })
          .catch(err => {
            console.log(err);
            reject(err)
          });
      })
  })
}

module.exports.path_delete = path => {
  return new Promise((resolve, reject) => {
    AuthorModel
      .findOne(
        { id: path.author }
      )
      .then(pathTree => {
        let options = mongoBridge.transPathDeleteOption(pathTree, path);
        AuthorModel
          .findOneAndUpdate(
            { id: path.author },
            { '$set': { [options.position]: options.pathTree } },
            { 
              arrayFilters: options.arrayFilters,
              new: true
            }
          )
          .then(res => {
            resolve(res.articles)
          })
          .catch(err => {
            console.log(err);
            reject(err)
          });
        })
  })
}

module.exports.article_create = article => {
  let options = mongoBridge.transArticleCreateOption(article.path);

  async function createArticle(article) {
    let result = await Promise.all([
      new ArticleModel(article)
        .save(),
      AuthorModel
        .findOneAndUpdate(
          { id: article.author},
          { '$push': { [options.position]: article.id }},
          { arrayFilters: options.arrayFilters,
            new: true
          }
        )
      ]);

    return {
      article: result[0],
      author: result[1]
    }
  }

  return new Promise(async (resolve, reject) => {
    let res;
    try {
      res = await createArticle(article)
      resolve(res.article);
    } catch(err) {
      reject(err)
    }
  })
}

// module.exports.article_update = article => {
//   async function updateArticle(article) {
//     let result = await Promise.all([
//       ArticleModel
//       .findOneAndUpdate({id: article.id}, article)
//       .then(res => {
//         console.log('1')
//         resolve(res)
//       }),
//       // AuthorModel
//       //   .findOne({ 'id': article.author })
//       //   .then(articlesTree => {
//       //     let options = mongoBridge.transAuthorUpdateOption(articlesTree, article);
//       //     AuthorModel
//       //       .findOneAndUpdate(
//       //         { id: article.author},
//       //         { '$set': { [options.position]: options.articlesTree } },
//       //         { 
//       //           arrayFilters: options.arrayFilters,
//       //           new: true
//       //         }
//       //       )
//       //       .then(res => {
//       //         console.log(2)
//       //         resolve(res)
//       //       })
//       //       .catch(err => {
//       //         console.log(err);
//       //         reject(err)
//       //       }); 
//       //   })
//     ])
//     return {
//       article: result[0]
//     }
//   }

//   return new Promise(async (resolve, reject) => {
//     let res;
//     try {
//       res = await updateArticle(article)
//       console.log(res)
//       resolve(res.article);
//     } catch(err) {
//       reject(err)
//     }
//   })
// }

module.exports.article_update = article => {
  return new Promise((resolve, reject) => {
    ArticleModel
    .findOneAndUpdate({id: article.id}, article)
    .then(res => {
      resolve(res)
    })
    .catch(err => reject(err))  
  })
}

module.exports.article_delete = article => {
  return new Promise((resolve, reject) => {
    ArticleModel
      .deleteOne({ 'id': article.id }, { new: true})
      .then(res => {
        resolve(res)
      })
      .catch(err => reject(err))
  })
}

module.exports.article_get = id => {
  return new Promise((resolve, reject) => {
    ArticleModel
      .find({ 'id': id })
      .then(res => {
        resolve(res[0]);
      })
      .catch(err => reject(err))
  })
}

//尚有优化空间
module.exports.articles_get = options => {

  //封装： mongodb两次查询（count + list)
  async function getPage(currentPage, limit, query) {
    let result = await Promise.all([
      ArticleModel.countDocuments(query),
      ArticleModel.find(query).skip((currentPage - 1) * limit).limit(limit)
    ])
    return {
      total: result[0],
      list: result[1]
    }
  }

  let currentPage = options.currentPage || 1;
  let limit = options.limit || 0;
  let total;

  //过滤搜索条件1： 必须同时满足以下字段
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

  //过滤条件2： 多个字段中任一含有查询字符串即可
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

  // //此处根据规则，指定在数据库高效搜索的具体方式
  return new Promise(async (resolve, reject) => {
    let res;
    try {
      res = await getPage(currentPage, parseInt(limit), {...help1(options), ...help2(options)})
      resolve(res);
    } catch(err) {
      reject(err)
    }
  })
}

module.exports.author_get = (id, password) => {
  return new Promise((resolve, reject) => {
    AuthorModel
      .findOne({ "id": id, "password": password }, {"_id": 0, "password": 0})
      .then(res => {
        if(res) {
          resolve(res);
        } else {
          reject({
            errCode: -1,
            errMessage: 'authorId or password is wrong',
            result: null
          });
        }
      })
      .catch(err => reject(err));
  })
}

module.exports.authors_get = queryOptions => {
  return new Promise((resolve, reject) => {
    AuthorModel
      .find(queryOptions, {"_id": 0, "password": 0})
      .then(res => {
        if(res) {
          resolve(res);
        } else {
          reject({
            errCode: -1,
            errMessage: 'something is wrong',
            result: null
          });
        }
      })
      .catch(err => reject(err));
  })
}

module.exports.department_get = id => {
  return new Promise((resolve, reject) => {
    DepartmentModel
      .findOne({ "id": 'root' }, {"_id": 0})
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  })
}

/*
 * 1. 更新时，传入的path怎么处理，直接原地改字段，还是要根据path修改该deprtment的路径；
 * 2. 暂时直接原地更改（待优化）
 */

module.exports.department_update = department => {
  return new Promise((resolve, reject) => {
    DepartmentModel
      .findOne(
        { id: 'root' }
      )
      .then(departments => {
        let options = mongoBridge.transDepartmentUpdateOption(departments, department);
        DepartmentModel
          .findOneAndUpdate(
            { id: 'root'},
            { '$set': { [options.position]: options.departments } },
            { 
              arrayFilters: options.arrayFilters,
              new: true
            }
          )
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log(err);
            reject(err)
          });
        })
  })
}


//Mongoose操作(待修改)
module.exports.department_create = department => {
  let options = mongoBridge.transDepartmentCreateOption(department.path);
  return new Promise((resolve, reject) => {
    DepartmentModel
      .findOneAndUpdate( 
        // mongoBridge.getQueryOption(department.path), //深层次查询的例子
        { id: 'root'},
        { '$push': { [options.position]: department }},
        { arrayFilters: options.arrayFilters, //深层次查询的样子
          new: true
        }
      )
      .then(res => resolve(res))
      .catch(err => {
        console.log(err)
        reject(err)
      });
  })
}

// //Mongoose操作(转换后的样子)
// module.exports.department_create = department => {
//   return new Promise((resolve, reject) => {
//     let position = 'children.$[id0].children.$[id1].children';
//     DepartmentModel
//       .findOneAndUpdate( 
//         // mongoBridge.getQueryOption(department.path),
//         { id: 'root'},
//         { '$push': { [position]: department }},
//         { arrayFilters: [{'id0.id': department.path[0]}, {'id1.id': department.path[1]}],
//           new: true
//         }
//       )
//       .then(res => resolve(res))
//       .catch(err => {
//         console.log(err)
//         reject(err)
//       });
//   })
// }


// module.exports.department_delete = id => {
//   return new Promise((resolve, reject) => {
//     console.log(id)
//     DepartmentModel
//       .remove({ "id": id })
//       .then(res => {
//         console.log(res)
//         resolve(res)
//       })
//       .catch(err => reject(err));
//   })
// }


module.exports.department_delete = department => {
  return new Promise((resolve, reject) => {
    DepartmentModel
      .findOne(
        { id: 'root' }
      )
      .then(departments => {
        let options = mongoBridge.transDepartmentDeleteOption(departments, department);
        DepartmentModel
          .findOneAndUpdate(
            { id: 'root'},
            { '$set': { [options.position]: options.departments } },
            { 
              arrayFilters: options.arrayFilters,
              new: true
            }
          )
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log(err);
            reject(err)
          });
        })
  })
}

module.exports.stars_get = id => {

  // function getStarsArticle(ids) {
  //   console.log(2)
  //   let results = [];
  //   ids.map(async articleId => {
  //     console.log(3)
  //     ArticleModel
  //       .findOne({ id: articleId })
  //       .then(article => {
  //         console.log(4)
  //         results.push(article)
  //       })
  //   })
  //   console.log(5)
  //   return results;
  // }

  // function getStarsArticle(ids) {
  //   return new Promise((resolve, reject) => {
  //     let results = [];
  //     ids.map((articleId, index) => {
  //       ArticleModel
  //         .findOne({ id: articleId })
  //         .then(article => {
  //           results.push(article)
  //         })
  //     })

  //   })
  // }


  return new Promise((resolve, reject) => {
    AuthorModel
      .findOne({ 'id': id }, {'stars': 1, '_id': 0})
      // .populate('stars') //暂时不用"填充"运算符
      .then(res => {
        let stars = [];
        res.stars.map((articleId, index) => {
          ArticleModel
            .findOne({id: articleId}, {_id: 0})
            .then(article => {
              stars.push(article);
              //该判断步骤需要优化
              if(res.stars.length == stars.length) {
                resolve(stars)
              }
            })
        })
      })
      .catch(err => reject(err))
  })
}

module.exports.star_post = (authorId, articleId) => {
  return new Promise((resolve, reject) => {
    AuthorModel
      .findOneAndUpdate(
        { 'id': authorId },
        { '$push': { stars: articleId } },
        { new: true}
      )
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err))
  })
}

module.exports.star_delete = (authorId, articleId) => {
  return new Promise((resolve, reject) => {
    AuthorModel
      .findOneAndUpdate(
        { 'id': authorId },
        { '$pull': { stars: articleId } },
        { new: true}
      )
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err))
  })
}

module.exports.my_get = id => {
  return new Promise((resolve, reject) => {
    AuthorModel
      .find({ 'id': id }, {'articles': 1, '_id': 0})
      .then(res => {
        resolve(res[0]);
      })
      .catch(err => reject(err))
  })
}

module.exports.path_get = id => {
  return new Promise((resolve, reject) => {
    AuthorModel
      .findOne({ 'id': id }, {'articles': 1, '_id': 0})
      .then(res => {
        resolve(res.articles);
      })
      .catch(err => reject(err))
  })
}


// //Mongoose操作(待修改)
// module.exports.my_create = articlesTree => {
//   let options = mongoBridge.transDepartmentCreateOption(department.path);
//   return new Promise((resolve, reject) => {
//     DepartmentModel
//       .findOneAndUpdate( 
//         { id: 'root'},
//         { '$push': { [options.position]: department }},
//         { arrayFilters: options.arrayFilters, //深层次查询的样子
//           new: true
//         }
//       )
//       .then(res => resolve(res))
//       .catch(err => {
//         console.log(err)
//         reject(err)
//       });
//   })
// }

// module.exports.my_update = department => {
//   return new Promise((resolve, reject) => {
//     DepartmentModel
//       .findOne(
//         { id: 'root' }
//       )
//       .then(departments => {
//         let options = mongoBridge.transDepartmentUpdateOption(departments, department);
//         DepartmentModel
//           .findOneAndUpdate(
//             { id: 'root'},
//             { '$set': { [options.position]: options.departments } },
//             { 
//               arrayFilters: options.arrayFilters,
//               new: true
//             }
//           )
//           .then(res => {
//             resolve(res)
//           })
//           .catch(err => {
//             console.log(err);
//             reject(err)
//           });
//         })
//   })
// }