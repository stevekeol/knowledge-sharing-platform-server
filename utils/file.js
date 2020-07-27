/*******************************************
*
* 文件操作层
*
********************************************/
const fs = require('fs');
const path = require('path');
const formidable = require('formidable'); //处理上传的文件
const { v4: uuid } = require('uuid'); //全局唯一化命名
const common = require('../utils/common.js');
const config = require('./config.js');

module.exports.saveFile = req => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
      if(err) 
        reject(err);

      //修复了editormd编辑器的专属字段bug
      let file = files.someExpressFiles || files['editormd-image-file'];

      let fileName = `/${uuid()}.${common.getExtenName(file.type)}`;
      let fileUrl = `http://${common.getAddressIp()}:${config.port}/images${fileName}`;

      fs.writeFileSync(path.join(__dirname, `../public/images/${fileName}`), fs.readFileSync(file.path));
      
      let res = {
        success: 1,   // 0 表示上传失败，1 表示上传成功
        message: 'success',
        dialog_id: '156021892199821',
        url: fileUrl //上传成功时才返回，就是图片的访问地址        
      }
      resolve(res);
    });    
  })
}