const mongoose = require('mongoose');
const schemas = require('./schemas.js');
const config = require('./config.js');

mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const ArticleModel = mongoose.model('article', schemas.getSchema('article'));
const AuthorModel = mongoose.model('author', schemas.getSchema('author'));
const DepartmentModel = mongoose.model('department', schemas.getSchema('department'));

module.exports = {
  ArticleModel,
  AuthorModel,
  DepartmentModel
}