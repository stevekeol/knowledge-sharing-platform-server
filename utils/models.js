const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wechatInfo = new Schema({
  openid: String, //主键
  nickName: String,
  avatarUrl: String,
  gender: Number,
  country: String,
  province: String,
  city: String,
  location: Array,
  createTime: String
},{autoIndex: false, versionKey: false});

const userHelp = new Schema({
  id: Number, //主键(求助单id)
  openid: String,
  name: String,
  phone: String, //String
  address: String,
  location: Array,
  age: Number,
  key: String, //求助关键词, 暂用字符串
  timeOfIllness: String, //发病时间？后期咋办
  desc: String, //求助详情描述
  imgList: Array, //图片的url数组
  level: Number, //0/1/2: 一般，加急，紧急
  link: String, //链接-自己填写的默认为"祝融"
  status: String, //pending,resolve,reject,cancel,0-即还未审核
  createTime: String,
  updateTime: String //默认等于createTime
},{autoIndex: false, versionKey: false});

const feedback = new Schema({
  openid: String,
  nickName: String,
  avatarUrl: String,
  content: String,
  createTime: String
},{autoIndex: false, versionKey: false});

const block = new Schema({
  height: Number,
  previousHash: String,
  timestamp: String,
  data: String,
  hash: String
}, {autoIndex: false, versionKey: false})

const paper = new Schema({
  
})

module.exports = {
  getSchema: function(name) {
    switch(name) {
      case 'wechatInfo':
        return wechatInfo;
      case 'userHelp':
        return userHelp;
      case 'feedback':
        return feedback;
      case 'block':
        return block;      
    }
  }
};
