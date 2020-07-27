const express = require('express');
const router = express.Router();
const api = require('./api.js');


/*******************************
 * post: article 创建文章
 * get: article 查询文章
**********************************/
router.post('/article', api.article_post);
router.get('/article', api.article_get);
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
