const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const author = new Schema({
  id: String, //作者员工号
  name: String, //作者姓名
  articles: Schema.Types.Mixed, //文件树
}, {autoIndex: false, versionKey: false})

const article = new Schema({
  id: String, //文章的UUID(主键)
  name: String, //文章名
  author: String, //文章作者(作者Schema的主键)
  abstract: String, //文章摘要
  content: String, //文章内容
  tags: Array, //文章标签(元素为String)
  categories: Array, //文章所属类别(元素为String)
  format: String, //文章格式('md'之类)
  path: Array, //文章所属的路径(即: 作者的文件树路径)(元素为作者文章树的路径id)
  state: String, //文章当前状态(草稿/审核/发表/删除...)
  authority: Array, //文章的授权范围(元素为部门的id)
  createTime: String, //文章创建时间
  updateTime: String //文章更新时间
}, {autoIndex: false, versionKey: false})

module.exports = {
  getSchema: function(name) {
    switch(name) {
      case 'author':
        return author;
      case 'article':
        return article; 
    }
  }
};