/*******************************************
*
* 数据库操作层
*
********************************************/
const mongoose = require('mongoose');
const models = require('./models.js');
const common = require('./common.js');

//数据库连接
mongoose.connect('mongodb://BFChainer:zhangjie2020@127.0.0.1:27017/bnqkl', { useNewUrlParser: true, useUnifiedTopology: true });


const wechatInfoModel = mongoose.model('wechatInfo', models.getSchema('wechatInfo')); 
const userHelpModel = mongoose.model('userHelp', models.getSchema('userHelp')); 
const feedbackModel = mongoose.model('feedback', models.getSchema('feedback')); 

// const db = mongoose.connection;
// db.userHelp.ensureIndex({'location': '2d'})

module.exports.postWechatInfo = function(wechatInfo) {
  return new Promise((resolve, reject) => {
    new wechatInfoModel(wechatInfo)
      .save()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getWechatInfo = function(openid) {
  return new Promise((resolve, reject) => {
    wechatInfoModel
      .find({'openid': openid})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

//自增id
module.exports.postUserHelp = function(userHelpInfo) {
  return new Promise((resolve, reject) => {
    new userHelpModel(userHelpInfo)
      .save()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getUserHelp = function(id) {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find({'id': id})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getUserHelpCheckout = function() {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find({'status': "0"})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

//bug
module.exports.updateUserHelp = function(query, updatedInfo) {
  console.log(query);
  console.log(updatedInfo);
  return new Promise((resolve, reject) => {
    userHelpModel
      .findOneAndUpdate(query, updatedInfo)
      .then((res) => {
        console.log(res);
        resolve(res)})
      .catch((err) => reject(err));
  })
}

//??
module.exports.getNearbyHelps = function(center, distance, limit) {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find({location:{"$near": center, $maxDistance: distance}}).limit(limit)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

//获取所有的求助信息
module.exports.getAllHelps = function() {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getRecentHelps = function(openid) {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find({'openid': openid})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.postFeedback = function(feedback) {
  return new Promise((resolve, reject) => {
    feedbackModel
      .save(feedback)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getFeedback = function(openid) {
  return new Promise((resolve, reject) => {
    feedbackModel
      .find({'openid': openid})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}


// //mongodb批量录入样例
// let id = 10001;
// for(let i = 0; i < mockData.length; i++) {
//   let help = new userHelpModel({
//     id: id++,
//     openid: 'oJFag4nmOhHAWYtMRyjMk5MUVzqU', //暂时用的我的
//     name: mockData[i].name,
//     phone: mockData[i].contact[0],
//     address: mockData[i].address,
//     location: [mockData[i].latitude, mockData[i].longitude],
//     desc: mockData[i].desc, //求助详情描述
//     level: 2, //0/1/2: 一般，加急，紧急
//     link: mockData[i].link, //链接-自己填写的默认为"祝融"
//     status: 'pending', //pending,resolve,reject,cancel
//     timeOfIllness: mockData[i].timeOfIllness, //发病时间？后期咋办
//     images: [], //url数组
//     createTime: common.formatTime(new Date()),
//     updateTime: common.formatTime(new Date()) //默认等于createTime    
//   })
//   help.save().then(() => console.log(`${i}: saved`));
// }

