// 前端页面，取出url中参数

const URL = require('url');  
const QUERYSTRING = require('querystring');

// 取出查询参数(从完整url中取出某个具体的参数)
const getRequestParam = function (req, param) {
	var params = QUERYSTRING.parse(URL.parse(req.url).query);
	return params[param];
};


//取年月日时分秒
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

// 取年月日
const formatSimpleTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-');
}

//补0操作
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

module.exports.getRequestParam = getRequestParam;
module.exports.formatTime = formatTime;
module.exports.formatSimpleTime = formatSimpleTime;