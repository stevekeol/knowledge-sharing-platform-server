const URL = require('url');  
const QUERYSTRING = require('querystring');

// 取出查询参数(从完整url中取出某个具体的参数)
module.exports.getRequestParam = function (req, param) {
	let params = QUERYSTRING.parse(URL.parse(req.url).query);
	return params[param];
};


//取年月日时分秒
module.exports.formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

// 取年月日
module.exports.formatSimpleTime = date => {
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

//获取本机IP地址
module.exports.getAddressIp = () => {
  let interfaces = require('os').networkInterfaces(); //引用了os核心模块
  for(let devName in interfaces){
      let iface = interfaces[devName];
      for(let i=0; i < iface.length; i++){
          let alias = iface[i];
          if( alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal ){
              return alias.address;
          }
      }
  }  
}

//获取文件扩展名
module.exports.getExtenName = (str) => str.split('/')[1];