var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var common = require('../routes/common.js');

// var auth = new Schema({
//     phone: String,
//     password: String,
//     createTime: Date,
// },{autoIndex: false});

var employee = new Schema({
    phone: String,
    password: String,
    name: String,
    avatorUrl: String,
    openid: String,
    group: String,
    role: String, //admin, leader, worker
    registers: {type: Array, default: []},
    deals: {type: Array, default: []},
    createTime: String
},{autoIndex: false, versionKey: false});

var client = new Schema({
    phone: String,
    name: String,
    address: String,
    contact: {type: Object, default: {}},
    register: Boolean,
    deal: Boolean,
    appointment: {type: Object, default: {}},
    communicationHistory: {type: Array, default: []},
    createTime: String
},{autoIndex: false, versionKey: false});

module.exports = {
    getSchema: function(name) {
        switch(name) {
            // case 'auth':
            //     return auth;
            case 'employee':
                return employee;
            case 'client':
                return client;
        }
    }
};
