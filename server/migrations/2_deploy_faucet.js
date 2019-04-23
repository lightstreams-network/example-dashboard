const Faucet = artifacts.require("Faucet");

module.exports = function(deployer) {
  deployer.deploy(Faucet)
    .then((instance) => {
      console.log(`Distribution contract deployed! ${instance.address}`)
    });
};