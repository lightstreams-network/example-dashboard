# Lightstreams Smart Vault Dashboard

Lightstreams Smart Vault Dashboard app showcase an example of a decentralize app (Dapp)
using [Lightstreams Smart Vault SDK](https://docs.lightstreams.network/getting-started/quick-start/)
in a NodeJS.

Using this DApp you will be able to upload your files uploaded into a Lightstreams Smart Vault
node and manage the its distribution and acceptability. In addition you will be able
to also request access to other users files and manage the pending request to your own content made by
other users.

## Requirements

### Smart Vault

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

### Create an application Faucet account

Your application will require to have an lightstreams account owner which acts
as a faucet account for your application users.

In meanwhile you have your smart vault node running you can use the expose HTTP API
for that using following command:

```
curl -X POST \
  'http://localhost:9091/user/signup?=' \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{"password": "{YOUR_PASSWORD"}'
```

In the response you obtain your Lightstreams wallet address such as follow:
```
{"account":"0x7994c47Dd04DEB53992EB244e997E73A63660249"}
```

Now you will need to request funds to that account, you can contact Lightstreams Dev Team
either [Telegram](https://t.me/LightstreamsDevelopers) or on the [Discuss forum](https://discuss.lightstreams.network/c/dev)

***You cannot wait...Use `--standalone`)***

In case you do not want to connect to Lightstreams decentralize network, `sirius`, we also provide
the alternative of running an isolate network, `standalone`. For that you only
need to replace on above commands `--sirius` by `--standalone`.

This network is created with a genesis account `0xc916cfe5c83dd4fc3c3b0bf2ec2d4e401782875e`
holding 3M tokens and its password is `WelcomeToSirius`.


## Launching the DApp

This application is split into two independent parts which could be launched on different
servers for a better decentralisation:
- [Server](/server/README.md) NodeJS express server connected to Lightstreams node
- [UI](/app/README.md) React application connected to Dashboard server.


