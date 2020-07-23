const express = require('express');
const router = express.Router();
const api = require('./api.js');

/*******************************
post: wechatInfo 微信用户的个人信息（openid/avatar/nickName/...）的保存
post: userHelp 保存某个用户求助信息（每条都包含个人的openid/name/phone/其余字段），其中openid可利用populate展开。
get: userHelp 获取某个用户的求助信息（审核/浏览者查看）
patch: userHelp 修改用户求助信息的某个字段（审核/用户自己更改）
get: nearbyHelps获取附近所有的求助信息（数组返回）
get: recentHelps 获取最新的所有的求助信息（时间倒序，返回50条，供审核）
post: feedback 保存用户的反馈
get: feedback 查看某个反馈
**********************************/
router.post('/wechatInfo', api.wechatInfo);
router.post('/userHelp', api.userHelp_create);
router.get('/userHelp', api.userHelp_show);
router.patch('/userHelp', api.userHelp_update);
router.get('/nearbyHelps', api.nearbyHelps);
router.get('/recentHelps', api.recentHelps);
router.post('/feedback', api.feedback_create);
router.get('/feedback', api.feedback_show);
router.get('/checkout', api.userHelp_checkout);
router.get('/upToken', api.createUpToken);
router.get('/allHelps', api.allHelps);


router.post('/api/upload', api.upload);

//图片上传 - 测试接口
router.get('/', (req, res, next) => {
  res.send(`
    <h2>With <code>"express"</code> npm package</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});
module.exports = router;
