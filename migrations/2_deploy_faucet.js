const Faucet = artifacts.require("Faucet");

module.exports = function(deployer) {
  deployer.deploy(Faucet)
    .then((instance) => {
      console.log(`Faucet contract deployed! ${instance.address}`)
    });
};