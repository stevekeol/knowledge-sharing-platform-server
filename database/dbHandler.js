var mongoose = require('mongoose');
var models = require("./models");

var _getModel = function(type){
    return mongoose.model(type, models.getSchema(type));
};

module.exports = { 
	getModel: function(type){ 
		return _getModel(type);
	}
};


