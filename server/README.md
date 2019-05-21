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

***ONLY In case of `standalone`***

This application requires the usage of the following smart contracts:
- [Profile.sol](/server/contracts/Profile.sol) It is being deploy one per user
- [Dashboard.sol](/server/contracts/Dashboard.sol) Same across every dashboard app

Run the following command to compile the contracts using solidity compiler:
```
npm run compile
```

In case you are using `Standalone` network you also need to deploy the
`Dashboard.sol` smart contract by running:
```
npm run deploy-standalone
```

From the output above command we should extract the address:
```
Dashboard contract deployed! 0x8484d16daBb428aed04481FA9C6f8F3dE213fe7e
```

And replace the value in `.env`:
```
SMARTCONTRACT_DASHBOARD_ADDRESS="0x8484d16daBb428aed04481FA9C6f8F3dE213fe7e"
```

### Run server

Once we completed all the installation steps the latest step is to run the server:
```
npm run start
```

This will run local server on port `:3000`.