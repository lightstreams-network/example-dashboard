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

## Local Smart Vault

### Alternative 1: Smart Vault (Sirius)

***Launch smart vault node***

In order to make this application to work you will require to have a local node
of Lightstreams Smart Vault. Follow [this guide](https://docs.lightstreams.network/getting-started/install/)
for the installation steps.

Once you complete the installation of the required software you will need to run
your own smart vault node of and exposes its [API](https://docs.lightstreams.network/api-docs) over the HTTP protocol
which the application server is going to be connected to.

Firstly, we initialize the smart vault node:
```
leth init --nodeid=1 --network=sirius --force
```

Then, run the node:
```
leth run --nodeid=1 --network=sirius --https
```

Once the node is synchronized, after few minutes, the following ports are going to be exposed locally
from your smart vault node:
- `9091`: [Smart Vault API](https://docs.lightstreams.network/api-docs/)
- `8545`: [Lightchain](https://github.com/lightstreams-network/lightchain) RPC


In meanwhile you have your smart vault node is synchronizing, you can check which is the latest
block using our [sirius block explorer](https://explorer.sirius.lightstreams.io)

***Create server stake holder account***

By running the next command on a terminal, and using the local smart vault HTTP API
you can create a new account which is going to be used as the stake holder account of our server:
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

Now you have to update `.env` with your local server account:
```
STAKEHOLDER_ADDRESS="0x7994c47Dd04DEB53992EB244e997E73A63660249"
STAKEHOLDER_ADDRESS_PWD="${YOUR_PASSWORD}"
```

This account will require some funds so you can request some free tokens by contacting Lightstreams Dev Team
on [Telegram](https://t.me/LightstreamsDevelopers) or on the [Discuss forum](https://discuss.lightstreams.network/c/dev)

For sirius Lightstreams team already deployed a Faucet smart contracts which is being topup by
by Lightstreams team and a Dashboard smart contract were every user is registered. Those
smart contracts address can be found at the `.env` file:
```
SMARTCONTRACT_FAUCET_ADDRESS="0x9F2A7b9e39fa2df828686efB5a0e94c016D88761"
SMARTCONTRACT_DASHBOARD_ADDRESS="0x8484d16daBb428aed04481FA9C6f8F3dE213fe7e"
```

### Alternative 2: Smart Vault (Standalone)

In case you do not want to connect to Lightstreams `sirius network`, you can also
run a smart vault node over an isolate network of `standalone`. For that you only
need to replace on above commands `--sirius` by `--standalone` on the steps above.

This standalone network is created with a genesis account `0xc916cfe5c83dd4fc3c3b0bf2ec2d4e401782875e`
which hold 300,000,000 tokens and its password is `WelcomeToSirius`. This
account can be used as your server stake holder account by modifying `.env`
with the following values:
```
STAKEHOLDER_ADDRESS="0xc916cfe5c83dd4fc3c3b0bf2ec2d4e401782875e"
STAKEHOLDER_ADDRESS_PWD="{WelcomeToSirius}"
```

This network is created completely empty therefore we will need to deploy ourselves
the [Dashboard.sol](/server/contracts/Dashboard.sol) and [Faucet.sol](/server/contracts/Faucet.sol).
For that we only need to run the following command after the `STAKEHOLDER_ADDRESS`
and `STAKEHOLDER_ADDRESS_PWD` have been updated:
```
npm run deploy-standalone
```

Output will be:
```bash
...
Faucet contract deployed! 0x9F2A7b9e39fa2df828686efB5a0e94c016D88761
...
Dashboard contract deployed! 0x8484d16daBb428aed04481FA9C6f8F3dE213fe7e
...
```

Now we have to replace the addresses of those smart contract in `.env` as follow:
```
SMARTCONTRACT_FAUCET_ADDRESS="0x9F2A7b9e39fa2df828686efB5a0e94c016D88761"
SMARTCONTRACT_DASHBOARD_ADDRESS="0x8484d16daBb428aed04481FA9C6f8F3dE213fe7e"
```

The **last step** is to top-up the Faucet smart contract which is funding user activities.
For that we will use the running smart vault api using the following command.

```bash
curl -X POST \
  http://localhost:9091/wallet/transfer \
  -H 'Content-Type: application/json' \
  -d '{"from":"0xc916cfe5c83dd4fc3c3b0bf2ec2d4e401782875e","password":"WelcomeToSirius","to":"0x9F2A7b9e39fa2df828686efB5a0e94c016D88761","amount_wei":"1000000000000000000000"}'
```

Which is sending 1000 PHT to the Faucet smart contract `0x9F2A7b9e39fa2df828686efB5a0e94c016D88761`.


## Run NodeJS server

Once we completed all the installation steps and you have your local gateway running,
the latest step is to run the server:
```
npm run start
```

This will run local server on port `:3000` by default, but it could be modified
on `.env`.