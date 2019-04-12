# Project Tech Notes

Include notes about ideas and progress done on the project

## Use cases

- Content creators can upload content
- Content creators can sell their content
- Content requires to have: Title, Description, Cover
- Content creator can cash out the profit made through the platform
- Every node should be on the same state regarding the content upload, purchased
- Users can create an account using only account_id and password
- Users can purchase content only once
- New users should have be awarded with few tokens to allow running txs


## How to

### Content creators can upload content

Deploy an smart contract to hold information about `MyShop.sol`

- Published content by content creator
- Metadata address, title, description

### Content creators can sell their content

Amending contract `MyShop.sol` we should include:
- Purchasing receipts
- Dates

### Content requires to have: Title, Description, Cover

Amending contract `MyShop.sol` we should include:
- List of books and their metadata

### Content creator can cash out the profit made through the platform

On every purchase `MyShop.sol` hold the tokens till content creator
decides to cash-out them

### Every node should be on the same state regarding the content upload, purchased

At the smart contract `MyShop.sol` the list of every content uploaded using this tool,
regardless the node used. Every while we should be pooling from this smart contract
the latest list and update the a local db in order to optimize read access to blockchain.

Along with those list of files we should have stored inside `MyShop.sol`:
- public metadata file ipfs hash(`meta`)
- public metadata cover ipfs hash (@TODO)
- acl smart contract of the file (`acl`)
- acl smart contract of the cover (`acl`)

Once content we have the list of files, we scrap the rest of the information using the Gateway(leth)
and store it into local node dbs which speed-up next reading processes.

## Side work

### Leth

In order to correctly integrate the functionalities required by this project the following to issues should be sorted
- [#122](https://github.com/lightstreams-network/go-lightstreams/issues/122) Allow to grant public access to content, therefore we can
upload into IPFS the cover image and everyone can see it.
- [#124](https://github.com/lightstreams-network/go-lightstreams/issues/124) Allow to retrieve the metadata information stored in IPFS via Leth