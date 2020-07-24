/*******************************************
*
* 桥接层：连接路由层 + 数据库操作层
*
********************************************/
const mongodb = require('../utils/mongodb.js');
const common = require('../utils/common.js');
const formidable = require('formidable');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


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
//图片期待返回的格式: 172.30.94.93:9527/images/98129823t9391020340047010.png(markdown中存储的是相对路径，并没有局域网IP)
module.exports.upload = function(req, res, next) {
	// console.log(req);
  const form = formidable({ multiples: true });

  function getExtentName(str) {
  	let res = str.split('/');
  }

  form.parse(req, (err, fields, files) => {
    if(err) {
      next(err);
      return;
    }

    //修复了editormd编辑器的专属字段bug
    let file = files.someExpressFiles || files['editormd-image-file'];

    let fileName = `/${uuidv4()}.${common.getExtenName(file.type)}`;
    let fileUrl = `http://${common.getAddressIp()}:9527/images${fileName}`;
    console.log(fileName);
    console.log(fileUrl);
    console.log(common.getAddressIp());
    let result = fs.writeFileSync(path.join(__dirname, `../public/images/${fileName}`), fs.readFileSync(file.path));
    res.json({ 
      success: 1,   // 0 表示上传失败，1 表示上传成功
      message: 'success',
      dialog_id: '156021892199821',
      url: fileUrl    //上传成功时才返回，就是图片的访问地址
    });
  });
}

//获取区块模拟数据
module.exports.block = function(req, res, next) {
	mongodb.getBlock(req.query.height)
		.then(result => res.json(result));
}