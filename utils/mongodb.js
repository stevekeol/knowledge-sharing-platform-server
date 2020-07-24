/*******************************************
*
* 数据库操作层
*
********************************************/
const mongoose = require('mongoose');
const models = require('./models.js');
const common = require('./common.js');

//数据库连接
mongoose.connect('mongodb://BFChainer:zhangjie2020@127.0.0.1:27017/blocks', { useNewUrlParser: true, useUnifiedTopology: true });

const wechatInfoModel = mongoose.model('wechatInfo', models.getSchema('wechatInfo')); 
const userHelpModel = mongoose.model('userHelp', models.getSchema('userHelp')); 
const feedbackModel = mongoose.model('feedback', models.getSchema('feedback')); 
const blockModel = mongoose.model('block', models.getSchema('block'));

// const db = mongoose.connection;
// db.userHelp.ensureIndex({'location': '2d'})

module.exports.postWechatInfo = function(wechatInfo) {
  return new Promise((resolve, reject) => {
    new wechatInfoModel(wechatInfo)
      .save()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getWechatInfo = function(openid) {
  return new Promise((resolve, reject) => {
    wechatInfoModel
      .find({'openid': openid})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

//自增id
module.exports.postUserHelp = function(userHelpInfo) {
  return new Promise((resolve, reject) => {
    new userHelpModel(userHelpInfo)
      .save()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getUserHelp = function(id) {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find({'id': id})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getUserHelpCheckout = function() {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find({'status': "0"})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

//bug
module.exports.updateUserHelp = function(query, updatedInfo) {
  console.log(query);
  console.log(updatedInfo);
  return new Promise((resolve, reject) => {
    userHelpModel
      .findOneAndUpdate(query, updatedInfo)
      .then((res) => {
        console.log(res);
        resolve(res)})
      .catch((err) => reject(err));
  })
}

//??
module.exports.getNearbyHelps = function(center, distance, limit) {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find({location:{"$near": center, $maxDistance: distance}}).limit(limit)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

//获取所有的求助信息
module.exports.getAllHelps = function() {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getRecentHelps = function(openid) {
  return new Promise((resolve, reject) => {
    userHelpModel
      .find({'openid': openid})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.postFeedback = function(feedback) {
  return new Promise((resolve, reject) => {
    feedbackModel
      .save(feedback)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getFeedback = function(openid) {
  return new Promise((resolve, reject) => {
    feedbackModel
      .find({'openid': openid})
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  })
}

module.exports.getBlock = function(height) {
  return new Promise((resolve, reject) => {
    blockModel
      .find({'height': height}, {_id:0})
      .then((res) => resolve(res[0])) //取第一个元素，即将该对象从数组中取出来
      .catch((err) => reject(err));
  })
}


// //mongodb批量录入样例
// let id = 10001;
// for(let i = 0; i < mockData.length; i++) {
//   let help = new userHelpModel({
//     id: id++,
//     openid: 'oJFag4nmOhHAWYtMRyjMk5MUVzqU', //暂时用的我的
//     name: mockData[i].name,
//     phone: mockData[i].contact[0],
//     address: mockData[i].address,
//     location: [mockData[i].latitude, mockData[i].longitude],
//     desc: mockData[i].desc, //求助详情描述
//     level: 2, //0/1/2: 一般，加急，紧急
//     link: mockData[i].link, //链接-自己填写的默认为"祝融"
//     status: 'pending', //pending,resolve,reject,cancel
//     timeOfIllness: mockData[i].timeOfIllness, //发病时间？后期咋办
//     images: [], //url数组
//     createTime: common.formatTime(new Date()),
//     updateTime: common.formatTime(new Date()) //默认等于createTime    
//   })
//   help.save().then(() => console.log(`${i}: saved`));
// }

const CryptoJS = require('crypto-js');
const fs = require('fs');

class Block {
  /**
   * 构造函数
   * @param {Number} height 
   * @param {String} previousHash 
   * @param {Number} timestamp 
   * @param {*} data 
   * @param {String} hash 
   */
  constructor(height, previousHash, timestamp, data, hash) {
    this.height = height
    this.previousHash = previousHash + ''
    this.timestamp = timestamp
    this.data = data
    this.hash = hash + ''
  }

  static generateBlock(blockData, previousBlock) {
    const nextHeight = previousBlock.height + 1;
    const nextTimeStamp = new Date().getTime();
    //忽略MerkelRoot和Nonce
    const nextHash = CryptoJS.SHA256(nextHeight + previousBlock.hash + nextTimeStamp + blockData) + ''; 
    return new Block(nextHeight, previousBlock.hash, nextTimeStamp, blockData, nextHash);    
  }
}

class BlockChain {

  /**
   * 如果指定在历史BlockChain上继续增加区块，则从本地存储中取出；否则默认创建新的区块链
   * @param { string } historyChain
   */
  constructor(historyChain) {
    this.blocks = [this.getGenesisBlock()]
  }

  // constructor(historyChain) {
  //   if( historyChain) {
  //     let blocks = this.getHistoryChain(historyChain);
  //     this.blocks = blocks ? [blocks] : [this.getGenesisBlock()];
  //   } else {
  //     this.blocks = [this.getGenesisBlock()]
  //   }
  // }

  /**
   * 将区块链异步保存到文件中
   */
  async saveHistoryChain(file, block) {
    await fs.appendFile(file, JSON.stringify(block), err => {
      if (err) throw err;
      console.log(`Height: ${block.height} is saved.`);
    });    
  }

  /**
   * 从文件中同步读出历史区块数据
   */
  // getHistoryChain() {
  //   return fs.readFileSync('historyChain.txt', 'utf-8');
  // }  

  /**
   * 创建区块链起源块, 此块是硬编码
   */
  getGenesisBlock() {
    return new Block(0, '0', 1552801194452, 'GenesisBlock', '810f9e854ade9bb8730d776ea02622b65c02b82ffa163ecfe4cb151a14412ed4')
  }

  /**
   * 根据信息计算hash值
   */
  calcuteHash(height, previousHash, timestamp, data) {
    return CryptoJS.SHA256(height + previousHash + timestamp + data) + ''
  }

  /**
   * 得到区块链中最后一个块节点
   */
  getLatestBlock() {
    return this.blocks[this.blocks.length - 1]
  }

  /**
   * 计算当前链表的下一个区块
   * @param {*} blockData 
   */
  generateNextBlock(blockData) {
    const previousBlock = this.getLatestBlock()
    const nextIndex = previousBlock.height + 1
    const nextTimeStamp = new Date().getTime()
    const nextHash = this.calcuteHash(nextIndex, previousBlock.hash, nextTimeStamp, blockData)
    return new Block(nextIndex, previousBlock.hash, nextTimeStamp, blockData, nextHash)
  }

  /**
   * 判断新加入的块是否合法
   * @param {Block} newBlock 
   * @param {Block} previousBlock 
   */
  isValidNewBlock(newBlock, previousBlock) {
    if(
      !(newBlock instanceof Block) ||
      !(previousBlock instanceof Block)
    ) {
      return false
    }

    // 判断height
    if(newBlock.height !== previousBlock.height + 1) { 
      return false
    }

    // 判断hash值
    if(newBlock.previousHash !== previousBlock.hash) { 
      return false
    }

    // 计算新块的hash值是否符合规则
    if(this.calcuteHash(newBlock.height, newBlock.previousHash, newBlock.timestamp, newBlock.data) !== newBlock.hash) { 
      return false
    }

    return true
  }
  
  /**
   * 向区块链添加新节点
   * @param {Block} newBlock 
   */
  addBlock(newBlock) {
    if(this.isValidNewBlock(newBlock, this.getLatestBlock())) {
      this.blocks.push(newBlock)
      return true  
    }
    return false
  }

  /**
   * 判断新插入的区块链是否合法而且可以覆盖原来的节点
   * @param {Array} newChain 
   */
  isValidNewChain(newChain) {
    if(Array.isArray(newChain) === false || newChain.length === 0) {
      return false
    }

    let newChainLength = newChain.length,
      firstBlock = newChain[0]

    // 硬编码的起源块不能改变
    if(firstBlock.height === 0) {
      return false
    }

    // 移植新的链的长度 <= 现有链的长度
    // 新的链不可信
    if(newChainLength + firstBlock.height <= this.blocks.length) {
      return false
    }

    // 下面检查新的链能否移植
    // 以及新的链的每个节点是否符合规则
    if(!this.isValidNewBlock(firstBlock, this.blocks[firstBlock.height - 1])) {
      return false
    }

    for(let i = 1; i < newChainLength; ++i) {
      if(!this.isValidNewBlock(newChain[i], newChain[i - 1])) {
        return false
      }
    }

    return true
  }

  /**
   * 插入新链表
   * @param {Array} newChain 
   */
  addChain(newChain) {
    if(this.isValidNewChain(newChain)) {
      const height = newChain[0].height
      this.blocks.splice(height)
      this.blocks = this.blocks.concat(newChain)
      return true
    }
    return false
  }

  //打印该区块链的所有区块
  printBlockChain() {
    console.table(this.blocks);
  }

  //打印该区块链的最新区块
  printLastBlock() {
    console.table(this.blocks[this.blocks.length - 1]);
  }  
}

//生成区块数据
function generateBlockData() {
  const dataList = ['Zhangjie is cool', 'Pengxiaohua is cool', 'ChenZiqiang is cool', 'Fangguojun is cool', 'Lulina is beautiful', 'Maqicheng is cool', 'Wangchuanshuo is cool', 'Linshaoyuan is beautiful', 'Lulina is beautiful'];
  return dataList[Math.random() * dataList.length >> 0];
}


async function mockBlocks() {
  //实例化一个区块链
  const blockChain = new BlockChain('testNet');

  let height = 1;
  for(let height = 1; height <= 1000; height++) {

    let newBlock = Block.generateBlock(generateBlockData(), blockChain.getLatestBlock());
    blockChain.addBlock(newBlock)
    blockChain.printLastBlock() //仅打印最后一个区块

    let block = new blockModel(newBlock);
    await block.save().then(() => console.log(`${newBlock.height} is saved.`))
  }
}

//是否开启模拟区块
// mockBlocks();