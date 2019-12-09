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

module.exports.timeTravel = async (daysToTravel) => {
  await _timeTravel(3600 * 24 * daysToTravel);
  await _mineBlock();
};

module.exports.wei2pht = (wei) => {
  return web3.utils.fromWei(wei, 'ether');
};

module.exports.pht2wei = (pht) => {
  return web3.utils.toBN(web3.utils.toWei(pht.toString(), 'ether'));
};

module.exports.toBN = (value) => {
  return web3.utils.toBN(value);
};

module.exports.calculateGasCost = async function(gasAmount) {
    return new Promise(resolve => {
        web3.eth.getGasPrice().then(function (gasPrice) {
            resolve(web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gasAmount)));
        });
    })
};

module.exports.ItemAttr = {
  title: 0,
  desc: 1,
  meta: 2,
  acl: 3
};
