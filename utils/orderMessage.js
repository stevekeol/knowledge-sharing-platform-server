/********************************
 *
 * 订阅消息模块
 *
 *********************************/

var request = require('request');
const config = {
    AppID: 'AppID：wx798762e7a42acb20',
    AppSecret: '76ec183f1e8b8c7179a03f7affa7ea8e'
}

const sendTemplateMessage = function() {
  var options = { 
      url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.AppID}&secret=${config.AppSecret}`, 
      method: 'GET',
      headers:{
          'Content-Type':'application/json'
      }
  };

  request(options, function(err, response, body){
    if(!err && response.statusCode == 200) {
    	var options_test = {
    		url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${JSON.parse(body).access_token}`,
    		method: 'POST',
			headers:{
			  'Content-Type':'application/json'
			},
			body: JSON.stringify({
				touser: 'on2kp42Gp4BINwJa-RsRqVgpx1hI',
				template_id: 'FIeA_GqX_mu9D28ai9M6ZktvmKsfOdGZWoyNzVBts6g',
				page: '',
				form_id: 'da76b150c55142e1a662bb4a7eded7cf',
				data: {
					keyword1: {
						value: '张光辉',
						color: '#173177'
					},
					keyword1: {
						value: '15258800906',
						color: '#173177'
					},
					keyword1: {
						value: '杭州西湖区中南海',
						color: '#173177'
					},
					keyword1: {
						value: '2019-11-19 14:30',
						color: '#173177'
					},
					keyword1: {
						value: '购买伊拉克',
						color: '#173177'
					}																				
				}
			})
    	}
    	request(options_test, function(err, response, body) {
    		if(!err) {
    			console.log(body);
    		} else {
    			console.log(err);
    		}
    	})
    }else{
      console.log('api: getSleepScore error.');
    }
  });  	
}

module.exports.sendTemplateMessage = sendTemplateMessage;