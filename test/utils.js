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

const VI = {
  startTimestamp: 0,
  endTimestamp: 1,
  lockPeriod: 2,
  balanceInitial: 3,
  balanceClaimed: 4,
  balanceRemaining: 5,
  bonusInitial: 6,
  bonusClaimed: 7,
  bonusRemaining: 8,
  revocable: 9,
  revoked: 10
};

module.exports = {
  timeTravel,
  wei2pht: wei2Pht,
  pht2wei: pht2Wei,
  toBN: toBN,
  calculateGasCost: calculateGasCost,
  VI: VI
};