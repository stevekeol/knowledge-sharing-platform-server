/*************************************
 * logDate middleware.(格式化打印api时间戳)
 * Author: zhangjie
 * CreateTime: 2020-07-29 15:30
 *************************************/
const common = require('../utils/common.js');

const logDate = (req, res, next) => {
  if(`${req.url.split('?')[0]}` != '/favicon.ico'){
    console.log(`【${common.formatTime(new Date())}】: ${req.method} ${req.url.split('?')[0]}`);
  }
  next();
}

module.exports = logDate;