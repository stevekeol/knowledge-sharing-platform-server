/*******************************************
*
* 桥接层：连接路由层 + 数据库操作层
*
********************************************/
const mongodb = require('../utils/mongodb.js');
const common = require('../utils/common.js');
const qiniu = require('../utils/qiniu.js');

module.exports.wechatInfo = function(req, res, next) {
	req.body.wechatInfo.createTime = common.formatTime(new Date());
	mongodb.postWechatInfo(req.body.wechatInfo)
		.then((result) => {
			console.log(result);
			res.send({"errMsg": "ok", "result": result});
		});
}

module.exports.userHelp_create = function(req, res, next) {
	mongodb.postUserHelp(req.body.userHelpInfo)
		.then((result) => {
			console.log(result);
			res.send({"errMsg": "ok", "result": result});
		})	
}

module.exports.userHelp_show = function(req, res, next) {
	mongodb.getUserHelp(req.query.id)
		.then((result) => {
			console.log(result);
			res.send({"errMsg": "ok", "result": result});
		})
}

module.exports.userHelp_update = function(req, res, next) {
	mongodb.updateUserHelp({'id': req.body.id}, req.body.updatedInfo)
		.then((result) => {
			console.log(result);
			res.send({"errMsg": "ok", "result": result});
		})	
}

module.exports.userHelp_checkout = function(req, res, next) {
	mongodb.getUserHelpCheckout()
		.then((result) => {
			console.log(result);
			res.send({"errMsg": "ok", "result": result});
		})
}

module.exports.nearbyHelps = function(req, res, next) {
	mongodb.getNearbyHelps(req.body.center, 20, 50)
		.then((result) => {
			console.log(result);
			res.send({"errMsg": "ok", "result": result});
		})
}

module.exports.allHelps = function(req, res, next) {
	mongodb.getAllHelps()
		.then((result) => {
			// console.log(result);
			res.send({"errMsg": "ok", "result": result});
		})
}

module.exports.recentHelps = function(req, res, next) {
	mongodb.getRecentHelps(common.getRequestParam(req, 'openid'))
		.then((result) => {
			console.log(result);
			res.send({"errMsg": "ok", "result": result});
		})	
}

module.exports.feedback_create = function(req, res, next) {
	mongodb.postFeedback(req.body.feedback)
		.then((result) => {
			console.log(result);
			res.send({"errMsg": "ok", "result": result});
		})	
}

module.exports.feedback_show = function(req, res, next) {
	mongodb.getFeedback(common.getRequestParam(req, 'openid'))
		.then((result) => {
			console.log(result);
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