const express = require('express');
const router = express.Router();
const { jsonResponse } = require('src/lib/responses');
const { web3Cfg, urls } = require('src/lib/config');
const { jwtEncode } = require('src/services/session');
const gateway = require('src/services/gateway').gateway();
const { createUser } = require('src/services/user');
const session = require('src/services/session').passport();
const Web3 = require('src/services/web3');
const { weiToPht } = require('src/lib/ethereum');
const faucetSC = require('src/smartcontracts/faucet');
const shelvesService = require('src/services/shelves');
const { extractRequestAttrs, validateRequestAttrs } = require('src/lib/request');
const {  badInputResponse } = require('src/lib/responses');

function generate_random_string(string_length) {
  let random_string = '';
  let random_ascii;
  for ( let i = 0; i < string_length; i++ ) {
    random_ascii = Math.floor((Math.random() * 25) + 97);
    random_string += String.fromCharCode(random_ascii)
  }
  return random_string
}

router.post('/auth/token', async (req, res, next) => {
  const pwd = generate_random_string(7);
  const { account } = await gateway.user.signUp(pwd);
  user = await createUser({
    username: generate_random_string(7),
    password: pwd,
    ethAddress: account
  });

  const authToken = jwtEncode({ id: user.id });
  await faucetSC.requestFreeToken(await Web3(), {
    beneficiary: user.eth_address,
    amountInPht: '0.2'
  });
  res.json(jsonResponse({ token: authToken, user }));
});

router.get('/machine/config', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  res.json(jsonResponse({
    defaultAccount: req.user.eth_address,
    defaultPublicKey: 'null',
    defaultSignatureId: 'null',
    deviceId: req.user.id,
    localhost: urls.localhost,
    deploymentAccount: web3Cfg.from,
    deploymentPrice: '10',
  }));
});

router.get('/account/balance/:address', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { balance } = await gateway.wallet.balance(req.param("address"));
  res.json(jsonResponse({ balance: weiToPht(balance) }));
});

router.get('/contents', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  res.json(jsonResponse([
    {
      title: 'Mock Title 1',
      description: 'Mock Description 1',
      price: '100',
      contractAddr: 'QmP1htJLT1GEfQpXNHrLfYfgAYF7RigCxtEe5bPfGjdVTQ',
    }
  ]));
});

router.post('/contracts/contract/:metaAddr', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const metaAddr = req.param("metaAddr");
  const shelveItem = await shelvesService.findByFileHash(metaAddr);
  res.json(jsonResponse({
    contractID: shelveItem.acl,
    meta: {
      contractId: shelveItem.acl,
      address: shelveItem.metaAddr
    },
    publicState: {
      title: shelveItem.title,
      description: '@TODO',
    },
    publicStateChain: {
      current: {
        cover: {
          address: shelveItem.cover
        },
      }
    },
    metaAddr: shelveItem.file,
    price: shelveItem.price.toString(),
  }));
});

module.exports = router;