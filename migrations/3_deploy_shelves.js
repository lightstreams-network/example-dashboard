const ShopShelves = artifacts.require("ShopShelves");

module.exports = function(deployer) {
  deployer.deploy(ShopShelves)
    .then((instance) => {
      console.log(`Distribution contract deployed! ${instance.address}`)
    });
};