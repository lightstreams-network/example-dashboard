# Lightstreams Demo


## Development
```
npm run compile
npm run dev
```

## How to
### Deploy smart contracts
```
npm run deploy-sirius
```

## Compile smart contracts
```
npm run compile
```

## SqlLite

Connect
```
sqlite3 .database/demo.sqlite
```

Cleaning
```
drop table user;
```

## Deploys

### Sirius
```
2_deploy_faucet.js
==================

  Replacing 'Faucet'
  ------------------
  > transaction hash:    0xe668c223c291fcd2a7b2e9a4f80114c0759579565a0a5e4f43cab60937557539
  > Blocks: 0            Seconds: 0
  > contract address:    0xE520b26E1D6902417E76361e30677DB5a581216C
  > block number:        364701
  > block timestamp:     1555919610
  > account:             0xD119b8B038d3A67d34ca1D46e1898881626a082b
  > balance:             794.552423136
  > gas used:            563039
  > gas price:           500 gwei
  > value sent:          0 ETH
  > total cost:          0.2815195 ETH

Distribution contract deployed! 0xE520b26E1D6902417E76361e30677DB5a581216C

  > Saving migration to chain.
  > Saving artifacts
  -------------------------------------
  > Total cost:           0.2815195 ETH


3_deploy_shelves.js
===================

   Replacing 'Shelves'
   -------------------
   > transaction hash:    0xfbc5b9627b3bfa3e9a03d5771be3c5d93ef29e294abc2b3658147875be91c7ab
   > Blocks: 0            Seconds: 0
   > contract address:    0xa985cF71d99E83db05f59b53c506262F37CAfD6E
   > block number:        366468
   > block timestamp:     1556024062
   > account:             0xD119b8B038d3A67d34ca1D46e1898881626a082b
   > balance:             742.315456136
   > gas used:            1031023
   > gas price:           500 gwei
   > value sent:          0 ETH
   > total cost:          0.5155115 ETH

Distribution contract deployed! 0xa985cF71d99E83db05f59b53c506262F37CAfD6E

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:           0.5155115 ETH




```