/**
 * User: ggarrido
 * Date: 16/05/19 10:35
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8556"));
web3.eth.getAccounts()
    .then(console.log)
    .then(() => process.exit())
    .catch(console.error);