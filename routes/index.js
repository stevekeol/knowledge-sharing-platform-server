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
****************************************/
router.post('/login', generateToken);
router.post('/article', api.article_post);
router.get('/article', verifyToken, api.article_get);
router.get('/articles', api.articles_get);
router.post('/image', api.uploadImage);


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