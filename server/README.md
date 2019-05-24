# Lightstreams Smart Vault Dashboard - NodeJS Server

Dashboard server is intended to provide the endpoints for a correct usage of the [Dashboard UI](/app).

## Requirements
- npm 6.0+

## Installation

Install npm dependencies
```
$> npm install
```

Create your local environment file `.env.sample`:
```
$> cp .env-sample .env
```

## Run Server

### Alternative 1: Smart Vault (Sirius)

If you want to run a full decentralize node you can run your local instance of smart vault.

In order to make this application to work you will require to have a local node
of Lightstreams Smart Vault. Follow [this guide](https://docs.lightstreams.network/getting-started/install/)
for the installation steps.

Once you complete the installation of the required software you will need to run
a node of of the smart vault which exposes the `http` API for our Dashboard server to
connect to. Firstly, we initialize the smart vault node:
```
leth init --nodeid=1 --network=sirius --force
```

Then, run the node:
```
leth run --nodeid=1 --network=sirius --https
```

It will require few minutes to synchronize with [sirius network](https://explorer.sirius.lightstreams.io)
, once synchronization is completed you will have the following exposed ports:
- `9091`: [Smart Vault API](https://docs.lightstreams.network/api-docs/)
- `8545`: [Lightchain](https://github.com/lightstreams-network/lightchain) RPC

Your application will require to have an lightstreams account owner which acts
as a faucet account for your application users.

In meanwhile you have your smart vault node running you can use the expose HTTP API
for that using following command:

```
curl -X POST \
  'http://localhost:9091/user/signup' \
  -H 'Content-Type: application/json' \
  -d '{"password": "${YOUR_PASSWORD}"'
```

In the response you obtain your Lightstreams wallet address such as follow:
```
{"account":"0x7994c47Dd04DEB53992EB244e997E73A63660249"}
```

Update `.env` with your local server account:
```
STAKEHOLDER_ADDRESS="0x7994c47Dd04DEB53992EB244e997E73A63660249"
STAKEHOLDER_ADDRESS_PWD="${YOUR_PASSWORD}"
```

You will need to request funds to that account, so you need contact Lightstreams Dev Team
either [Telegram](https://t.me/LightstreamsDevelopers) or on the [Discuss forum](https://discuss.lightstreams.network/c/dev)

Over the Sirius network the require smart contracts were already deployed and they are
defined in the as the default values in `.env`:
```
SMARTCONTRACT_FAUCET_ADDRESS="0x9F2A7b9e39fa2df828686efB5a0e94c016D88761"
SMARTCONTRACT_DASHBOARD_ADDRESS="0x8484d16daBb428aed04481FA9C6f8F3dE213fe7e"
```

### Alternative 2: Smart Vault (Standalone)

In case you do not want to connect to Lightstreams decentralize network, `sirius`, we also provide
the alternative of running an isolate network, `standalone`. For that you only
need to replace on above commands `--sirius` by `--standalone`.

This network is created with a genesis account `0xc916cfe5c83dd4fc3c3b0bf2ec2d4e401782875e`
holding 300,000,000 tokens and its password is `WelcomeToSirius`.

Update `.env` with your local server account:
```
STAKEHOLDER_ADDRESS="0xc916cfe5c83dd4fc3c3b0bf2ec2d4e401782875e"
STAKEHOLDER_ADDRESS_PWD="{WelcomeToSirius}"
```

This application requires the usage of the following smart contracts:
- [Dashboard.sol](/server/contracts/Dashboard.sol) Same across every dashboard app
- [Faucet.sol](/server/contracts/Faucet.sol) Faucet Smart contract


In case you are using `Standalone` network you also need to deploy the
`Dashboard.sol` smart contract by running:
```
npm run deploy-standalone
```

From the output above command we should extract the address:
```bash
...
Faucet contract deployed! 0x9F2A7b9e39fa2df828686efB5a0e94c016D88761
...
Dashboard contract deployed! 0x8484d16daBb428aed04481FA9C6f8F3dE213fe7e
...
```

And replace the value in `.env`:
```
SMARTCONTRACT_FAUCET_ADDRESS="0x9F2A7b9e39fa2df828686efB5a0e94c016D88761"
SMARTCONTRACT_DASHBOARD_ADDRESS="0x8484d16daBb428aed04481FA9C6f8F3dE213fe7e"
```

The last step is to top-up the faucet smart contract in order to fund the user activities.
The following command will send 1000 PHT to the Faucet smart contract `0x9F2A7b9e39fa2df828686efB5a0e94c016D88761`.
```

curl -X POST \
  http://localhost:9091/wallet/transfer \
  -H 'Content-Type: application/json' \
  -d '{"from":"0xc916cfe5c83dd4fc3c3b0bf2ec2d4e401782875e","password":"WelcomeToSirius","to":"0x9F2A7b9e39fa2df828686efB5a0e94c016D88761","amount_wei":"1000000000000000000000"}'
  ```
## Run NodeJS server

Once we completed all the installation steps and you have your local gateway running,
the latest step is to run the server:
```
npm run start
```

This will run local server on port `:3000` by default, but it could be modified
on `.env`.