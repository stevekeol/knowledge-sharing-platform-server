var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('../database/models.js');
var common = require('../routes/common.js');
var async = require('async');

// var authModel = mongoose.model('auth', models.getSchema('auth')); 
var employeeModel = mongoose.model('employee', models.getSchema('employee')); 
var clientModel = mongoose.model('client', models.getSchema('client')); 

//验证手机号密码是否匹配
var getEmployee = function(phone) {
  return new Promise((resolve, reject) => {
    employeeModel.findOne({'phone': phone}, function(err, row) {
      if(row){
        resolve(row);
      } else {
        resolve(null);
      }
    })
  })
}

//新加入员工
var addEmployee = function(employeeInfo) {

  //此处查询两次，可否改善？
  return new Promise((resolve, reject) => {
    employeeModel.findOne({'phone': employeeInfo.phone}, function(err, row) {
      if(row) {
        employeeModel.findOneAndUpdate({'phone': employeeInfo.phone}, employeeInfo, {'new': true}, function(err, row) {
          if(err){
            resolve(null)
          } else {
            resolve(row);
          }      
        })
      } else {
        let employeeInfoTemp = Object.assign({}, employeeInfo, {"createTime": common.formatTime(new Date())});
        console.log(employeeInfoTemp);
        employeeModel.create(employeeInfoTemp, function(err, row) {
          if(err){
            resolve(null)
          } else {
            resolve(row);
          }
        })
      }
    })
  })
}


//新录入客户时，员工的字段更新
//此处是不是存在逻辑问题，若后面再成交该意向客户，会怎样？
var updateEmployeeClient = function(clientAndEmployeeInfo) {
  var updateInfoWithoutDeal = {
    $push: {
      'registers': {
        'name': clientAndEmployeeInfo.clientInfo.name, 
        'phone': clientAndEmployeeInfo.clientInfo.phone,
        'address':clientAndEmployeeInfo.clientInfo.address,
        'createTime': common.formatTime(new Date())
      }
    }
  }
  var updateInfoWithDeal = {
    $push: {
      'registers': {
        'name': clientAndEmployeeInfo.clientInfo.name, 
        'phone': clientAndEmployeeInfo.clientInfo.phone,
        'address':clientAndEmployeeInfo.clientInfo.address,
        'createTime': common.formatTime(new Date())
      },
      'deals': {
        'name': clientAndEmployeeInfo.clientInfo.name, 
        'phone': clientAndEmployeeInfo.clientInfo.phone,
        'address':clientAndEmployeeInfo.clientInfo.address,
        'createTime': common.formatTime(new Date())
      }
    }
  }  
  var updateInfo = clientAndEmployeeInfo.clientInfo.deal ? updateInfoWithDeal : updateInfoWithoutDeal;
  return new Promise((resolve, reject) => {
    employeeModel.findOneAndUpdate({'phone': clientAndEmployeeInfo.globalData.phone}, updateInfo, {'new': true}, function(err, result) {
        if(!err) resolve(result);
    });  
  })
}

//员工登录时，完善avatarUrl和openid
var updateEmployeeInfo = function(phone, userInfo) {
  var updateData = {
    'avatarUrl': userInfo.avatarUrl,
    'openid': userInfo.openid
  }

  return new Promise((resolve, reject) => {
    employeeModel.findOneAndUpdate({'phone': phone}, updateData, {'new': true}, function(err, result) {
      if(!err) resolve(result);
    });  
  })
}

//查找某个员工的资料
var findEmployee = function(employeeInfo) {
  return new Promise((resolve, reject) => {
    employeeModel.findOne({'phone': employeeInfo.phone}, function(err, row) {
      if(row) {
        resolve(row);
      } else {
        resolve(null)
      }
    })
  })
}

// 获取所有员工
var findEmployees = function() {
  return new Promise((resolve, reject) => {
    employeeModel.find({}, function(err, row) {
      if(row) {
        resolve(row);
      } else {
        resolve(null)
      }
    })
  })
}


//此处其实有两种功能：新增客户/更新客户资料
var addClient = function(clientAndEmployeeInfo) {
  //此处查询两次，可否改善？
  let clientInfo = clientAndEmployeeInfo.clientInfo;
  let employeeInfo = clientAndEmployeeInfo.globalData;

  let updateInfo = {
    phone: clientInfo.phone,
    name: clientInfo.name,
    address: clientInfo.address,
    contact: clientInfo.contact,
    register: true,
    deal: clientInfo.deal,
    appointment: clientInfo.appointment || {},
    communicationHistory: clientInfo.communicationHistory, // 此处可能存储失败？
    createTime: common.formatTime(new Date())
  }

  return new Promise((resolve, reject) => {
    clientModel.findOne({'phone': clientInfo.phone}, function(err, row) {
      if(row) {
        clientModel.findOneAndUpdate({'phone': clientInfo.phone}, updateInfo, {'new': true}, function(err, row) {
          if(err){
            resolve(null)
          } else {
            resolve(row);
          }
        })
      } else {
        console.log(updateInfo);
        clientModel.create(updateInfo, function(err, row) {
          if(err){
            resolve(null)
          } else {
            resolve(row);
          }
        })
      }
    })
  })
}

var checkPhone = function(clientInfo) {
  return new Promise((resolve, reject) => {
    clientModel.findOne({'phone': clientInfo.phone}, function(err, row) {
      if(row) {
        resolve(row);
      } else {
        resolve(null)
      }
    })
  })
}

var getClient = function(clientInfo) {
  return new Promise((resolve, reject) => {
    clientModel.findOne({'phone': clientInfo.phone}, function(err, row) {
      if(row) {
        resolve(row);
      } else {
        resolve(null)
      }
    })
  })
}

var deleteClient = function(phone) {
  return new Promise((resolve, reject) => {
    clientModel.findOneAndRemove({'phone': phone}, function(err, row) {
      console.log(row);
      if(row) {
        resolve(row);
      } else {
        resolve(null)
      }
    })
  })
}

var getClients = function() {
  return new Promise((resolve, reject) => {
    clientModel.find({}, function(err, row) {
      if(row) {
        resolve(row);
      } else {
        resolve(null)
      }
    })
  })
}


module.exports.getEmployee = getEmployee;
module.exports.addEmployee = addEmployee;
module.exports.findEmployee = findEmployee;
module.exports.findEmployees = findEmployees;
module.exports.addClient = addClient;
module.exports.getClient = getClient;
module.exports.deleteClient = deleteClient;
module.exports.getClients = getClients;
module.exports.updateEmployeeClient = updateEmployeeClient;
module.exports.updateEmployeeInfo = updateEmployeeInfo;
module.exports.checkPhone = checkPhone;
