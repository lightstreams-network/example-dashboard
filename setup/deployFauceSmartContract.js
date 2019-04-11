/**
 * User: ggarrido
 * Date: 10/04/19 16:54
 * Copyright 2019 (c) Lightstreams, Granada
 */

require('dotenv').config();

const Web3 = require("web3");

const { web3cfg } = require("src/lib/config");

// Read TokenDistribution ABI
var contents = fs.readFileSync("./build/contracts/Distribution.json");
var jsonContent = JSON.parse(contents);

const web3 = new Web3("http://localhost:8545");

const TokenDistribution = web3.eth.Contract(jsonContent.abi, "0xe2E4d49f002B8427eb50236D246599a80b58Febc", {
  defaultAccount: "0xd119b8b038d3a67d34ca1d46e1898881626a082b",
  defaultGasPrice: "500000000000"
});

TokenDistribution.methods
  .schedulePrivateSaleVesting("0xd119b8b038d3a67d34ca1d46e1898881626a082b", "1000000000000000000")
  .send({ "value": "10000000000000000000", "gasPrice": "500000000000" }, console.log);
