const Dashboard = artifacts.require("Dashboard");
const { Leth } = require('lightstreams-js-sdk');

module.exports = function(deployer) {
  const rootAcc = process.env.STAKEHOLDER_ADDRESS;
  deployer.then(() => {
    return Leth.ACL.create(web3, {from: rootAcc , owner: rootAcc, isPublic: true})
  }).then(txReceipt => {
    return deployer.deploy(Dashboard, txReceipt.contractAddress);
  }).then((instance) => {
    console.log(`Dashboard contract deployed! ${instance.address}`)
  });
};