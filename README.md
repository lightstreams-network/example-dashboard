# Lightstreams Smart Vault Dashboard

Lightstreams Smart Vault Dashboard app showcase an example of a decentralize app (Dapp)
using [Lightstreams Smart Vault SDK](https://docs.lightstreams.network/getting-started/quick-start/)
in a NodeJS.

This project also showcase the usage of [lightstreams-js-sdk](https://github.com/lightstreams-network/lightstreams-js-sdk),
a set of wrappers around Lightstreams Smart Vault and Web3js.

Using this DApp you will be able to upload your files uploaded into a Lightstreams Smart Vault
node to manage the its distribution and acceptability. In addition you will be able
to also request access to other users files and manage the pending request to your own content made by
other users.

## Live Demo

[https://demo.dashboard.lightstreams.io](https://demo.dashboard.lightstreams.io)

## Requirements

To run this project you need to have a local instance of the `Smart Vault` running
on your machine. Learn how to do that in [our getting started documentation](https://docs.lightstreams.network/products-1/smart-vault/getting-started)

Your smart vault node can either be connected to [`Standalone`](https://github.com/lightstreams-network/lightchain#standalone)
or `Sirius`.

**Init node**
```bash
$> leth init --nodeid=1 --network={standalone|sirius}
```

**Run node**
```bash
$> leth run --nodeid=1 --network={standalone|sirius} --https
```

> Note: In case you selected `Sirius` you have to wait till it syncs. You can
check the status of the network [in its block explorer](https://explorer.sirius.lightstreams.io)

## Getting started

### Install dependencies

```bash
yarn install
```

### Setup your environment

Firstly, copy sample .env as follow:
``` bash
$> cp .env.sample .env
```

> Note: The `STAKEHOLDER_ADDRESS` is used to top up users accounts with `5 PHT`
to fund the usage of the app.

**Option 1: Standalone Network**

Then, edit your `.env` with:
```
NODE_PATH=.
PORT=3000
DEBUG=*:*

GATEWAY_DOMAIN="http://localhost:9091"
WEB3_PROVIDER="http://localhost:8545"
NET_ID="161"

STAKEHOLDER_ADDRESS="0xc916cfe5c83dd4fc3c3b0bf2ec2d4e401782875e"
STAKEHOLDER_PASSWORD="WelcomeToSirius"
```

and after you have to compile and deploy `Dashboard.sol` contract to standalone network:

```bash
$> yarn truffle:deploy -- standalone
```

Account `0xc916cfe5c83dd4fc3c3b0bf2ec2d4e401782875e` is the genesis
account of Standalone

**Option 2: Sirius Network**

Firstly you will need to create a new wallet in your peer as follow:
```
$> leth user signup --nodeid=1 --network=sirius
Enter password: ****
{"account":"0xC37c560c2987F214e75868595a1db181E90Ee955"}
```

Then, edit your `.env` with:
```
NODE_PATH=.
PORT=3000
DEBUG=*:*

GATEWAY_DOMAIN="http://localhost:9091"
WEB3_PROVIDER="http://localhost:8545"
NET_ID="162"

STAKEHOLDER_ADDRESS="${YOUR_ACCOUNT}"
STAKEHOLDER_PASSWORD="${YOUR_PASSWORD}"

ADDRESS_DASHBOARD_CONTRACT="0xFe829259DA7B913528E6A994338aEbFa45E1faae"
```

Then you can request some free token [following this instructions](https://docs.lightstreams.network/products-1/smart-vault/getting-started/untitled#get-free-testing-tokens)

### Run dev server

Now it is time to execute a dev server:
```bash
$> yarn web:dev
```

## Screenshots

### Create an account

![Signup](/assets/signup.png?raw=true)

### Login

![Login](/assets/login.png?raw=true)

### Your user wallet

![Signup](/assets/wallet.png?raw=true)

#### Upload file

![Upload file](/assets/upload_file.png?raw=true)

#### My files

You can see the list of files you uploaded and which users have access to them. By clicking
on one of the little icon you can revoke the access to the users at anytime.
Also you can download the content of the files you uploaded.
![My Files](/assets/my_files.png?raw=true)

### Grant access to file

Grant access to other users to your content without waiting for a access request.
![Grant access to file](/assets/grant_access.png?raw=true)


### Request access to other user file

Insert the username of other user and load the list of available items of this user.
By clicking on the locker icon you will send a access request to the file owner. In case
you already got access to the file it will display the download action.
![Pending request](/assets/pending_requests.png?raw=true)

### Manage file access requests

On this section it will listed the pending access requests from other users to your files.
![Request file access](/assets/request_file_access.png?raw=true)


## Freemium Model

This project implements a simple freemium model where the `STAKEHOLDER_ADDRESS` account transfer
`5 PHT` tokens to every new user to fund the initial usage of it. Instead of Lightstreams team has
integrated a Gas Station Network(GSN), a standardized pattern within Ethereum community
 where users transaction are funded using an advance implementation of the contract design. If you want to
read more about this topic read [this medium article](https://medium.com/lightstreams/no-gas-needed-to-interact-with-lightstreams-dapps-41aea98d1089)

## Topics
- IPFS
- Ethereum
- Decentralized Application (DApp)
- Smart Vault

### License
[MIT LICENSE](/LICENSE)
