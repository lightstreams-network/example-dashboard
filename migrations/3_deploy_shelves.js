const Shelves = artifacts.require("Shelves");

module.exports = function(deployer) {
  deployer.deploy(Shelves)
    .then((instance) => {
      console.log(`Distribution contract deployed! ${instance.address}`)
    });
};