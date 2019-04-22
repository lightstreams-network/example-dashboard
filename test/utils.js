const timeTravel = async (daysToTravel) => {
  await _timeTravel(3600 * 24 * daysToTravel);
  await _mineBlock();
};

const wei2Pht = (wei) => {
  return web3.utils.fromWei(wei, 'ether');
};

const pht2Wei = (pht) => {
  return web3.utils.toBN(web3.utils.toWei(pht.toString(), 'ether'));
};

const toBN = (value) => {
  return web3.utils.toBN(value);
};

const calculateGasCost = async function(gasAmount) {
    return new Promise(resolve => {
        web3.eth.getGasPrice().then(function (gasPrice) {
            resolve(web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gasAmount)));
        });
    })
};

const _timeTravel = function(time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time], // 86400 is num seconds in day
      id: new Date().getTime()
    }, (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    });
  })
};

const _mineBlock = function() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_mine"
    }, (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    });
  })
};

const BookAttr = {
  title: 0,
  owner: 1,
  price: 2,
  file: 3,
  cover: 4,
  acl: 5,
  purchasers: 6,
};

module.exports = {
  timeTravel,
  wei2pht: wei2Pht,
  pht2wei: pht2Wei,
  toBN: toBN,
  calculateGasCost: calculateGasCost,
  BookAttr: BookAttr
};