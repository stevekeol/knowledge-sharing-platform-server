const express = require('express');
const router = express.Router();
const api = require('./api.js');
const verifyToken = require('../middleware/verifyToken.js');
const generateToken = require('../middleware/generateToken.js');

/****************************************
 * post: article 创建文章
 * get: article 查询文章
 * get: articles 查询所有符合过滤规则的文章
 * post: image 保存文本写作过程中上传的图片
 * get: login 登录(查询作者)
 * get: authors 获取所有作者列表
****************************************/
router.get('/login', generateToken);
router.get('/authors', api.authors_get);
router.post('/article', api.article_post);
router.delete('/article', api.article_delete);
router.get('/article', api.article_get);
router.get('/articles', api.articles_get);
router.post('/image', api.uploadImage);
router.post('/department', api.department_post);
router.get('/department', api.department_get);
router.delete('/department', api.department_delete);
router.post('/star', api.star_post);
router.get('/stars', api.stars_get);
router.delete('/star', api.star_delete);

router.get('/my', api.my_get);

router.post('/path', api.path_post);
router.get('/path', api.path_get);
router.delete('/path', api.path_delete);

// router.post('/my', api.my_post); //用post /article代替
// router.delete('/my', api.my_delete);

//图片上传 - 测试接口
router.get('/test', (req, res, next) => {
  res.send(`
    <h2>With <code>"express"</code> npm package</h2>
    <form action="/image" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});
module.exports = router;