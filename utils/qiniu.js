const qiniu = require('qiniu');

const bucket = 'ncp';
const accessKey = 'Q0FP7bNduQF5tp7TRpuBjeHjBWAoHy33F9OwDUkc';
const secretKey = 'ztnqUcVGw9IlO6Bi_PlJWLTi3EStmocCbxsLwlPp';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const options = {
    scope: bucket
};

const putPolicy = new qiniu.rs.PutPolicy(options);

//创建文件上传upToken
module.exports.createUpToken = function() {
  return new Promise((resolve, reject) => {
    resolve(putPolicy.uploadToken(mac));
  })    
}