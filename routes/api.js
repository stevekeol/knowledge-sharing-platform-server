/*******************************************
*
* 桥接层：连接路由层 + 数据库操作层
*
********************************************/
const mongodb = require('../utils/mongodb.js');
const common = require('../utils/common.js');
const formidable = require('formidable');
const fs = require('fs');

module.exports.wechatInfo = function(req, res, next) {
	req.body.wechatInfo.createTime = common.formatTime(new Date());
	mongodb.postWechatInfo(req.body.wechatInfo)
		.then((result) => {
			res.send({"errMsg": "ok", "result": result});
		});
}

module.exports.userHelp_create = function(req, res, next) {
	mongodb.postUserHelp(req.body.userHelpInfo)
		.then((result) => {
			res.send({"errMsg": "ok", "result": result});
		})	
}

module.exports.userHelp_show = function(req, res, next) {
	mongodb.getUserHelp(req.query.id)
		.then((result) => {
			res.send({"errMsg": "ok", "result": result});
		})
}

module.exports.userHelp_update = function(req, res, next) {
	mongodb.updateUserHelp({'id': req.body.id}, req.body.updatedInfo)
		.then((result) => {
			res.send({"errMsg": "ok", "result": result});
		})	
}

module.exports.userHelp_checkout = function(req, res, next) {
	mongodb.getUserHelpCheckout()
		.then((result) => {
			res.send({"errMsg": "ok", "result": result});
		})
}

module.exports.nearbyHelps = function(req, res, next) {
	mongodb.getNearbyHelps(req.body.center, 20, 50)
		.then((result) => {
			res.send({"errMsg": "ok", "result": result});
		})
}

module.exports.allHelps = function(req, res, next) {
	mongodb.getAllHelps()
		.then((result) => {
			res.send({"errMsg": "ok", "result": result});
		})
}

module.exports.recentHelps = function(req, res, next) {
	mongodb.getRecentHelps(common.getRequestParam(req, 'openid'))
		.then((result) => {
			res.send({"errMsg": "ok", "result": result});
		})	
}

module.exports.feedback_create = function(req, res, next) {
	mongodb.postFeedback(req.body.feedback)
		.then((result) => {
			res.send({"errMsg": "ok", "result": result});
		})	
}

module.exports.feedback_show = function(req, res, next) {
	mongodb.getFeedback(common.getRequestParam(req, 'openid'))
		.then((result) => {
			res.send({"errMsg": "ok", "result": result});
		})
}
module.exports.createUpToken = function(req, res, next) {
	qiniu.createUpToken()
		.then((upToken) => {
			console.log(upToken);
			res.send({"errMsg": "ok", "upToken": upToken});
		})
}

//图片上传处理逻辑 - 已验证可使用
//图片期待返回的格式: 10.27.31.230/images/98129823t9391020340047010.png
module.exports.upload = function(req, res, next) {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    let result = fs.writeFileSync("images/test.png", fs.readFileSync(files.someExpressFiles.path));
    res.json({ fields, files });
  });  
}
