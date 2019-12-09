const Dashboard = artifacts.require("Dashboard");

module.exports = function(deployer) {
  deployer.deploy(Dashboard)
    .then((instance) => {
      console.log(`Dashboard contract deployed! ${instance.address}`)
    });
};