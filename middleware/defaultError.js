/*************************************
 * defaultError middleware.(处理错误请求)
 * Author: zhangjie
 * CreateTime: 2020-07-29 15:30
 *************************************/
const defaultError = (req, res, next) => {
  const err = new Error(`${req.url} Not Found`);
  err.status = 404;
  res.end('The server is just for knowledge-sharing-platform@bnqkl.');
}


module.exports = defaultError;