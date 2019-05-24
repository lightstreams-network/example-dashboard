# Lightstreams Smart Vault Dashboard

Lightstreams Smart Vault Dashboard app showcase an example of a decentralize app (Dapp)
using [Lightstreams Smart Vault SDK](https://docs.lightstreams.network/getting-started/quick-start/)
in a NodeJS.

Using this DApp you will be able to upload your files uploaded into a Lightstreams Smart Vault
node and manage the its distribution and acceptability. In addition you will be able
to also request access to other users files and manage the pending request to your own content made by
other users.

## Features

**Create an account**
![Signup](docs/imgs/signup.png?raw=true)

**Login**
![Login](docs/imgs/login.png?raw=true)

**Your user wallet**
![Signup](docs/imgs/wallet.png?raw=true)

**Upload file**
![Upload file](docs/imgs/upload_file.png?raw=true)

**My files**
![My Files](docs/imgs/my_files.png?raw=true)
You can see the list of files you uploaded and which users have access to them. By clicking
on one of the little icon you can revoke the access to the users at anytime.

Also you can download the content of the files you uploaded.

**Grant access to file**
![Grant access to file](docs/imgs/grant_access.png?raw=true)
Grant access to other users to your content without waiting for a access request.

**Request access to other user file**
![Pending request](docs/imgs/pending_requests.png?raw=true)
Insert the username of other user and load the list of available items of this user.
By clicking on the locker icon you will send a access request to the file owner. In case
you already got access to the file it will display the download action.

**Request access to other user file**
![Request file access](docs/imgs/request_file_access.png?raw=true)
On this section it will listed the pending access requests from other users to your files.


## Freemium Model

This project implements a simple freemium model to fund users activity within the
platform. The source for this funding come from two different sources.

The first of them is what it was called stake holder account. This account
 is linked to every instance of the server application and it is funding the creation
 of new users through its own endpoints.

 The second funding source is an Faucet smart contract which will fund
 the activity of users up to 10 PHTs. This smart contract can be top up by every entity
 interested in the growth of the project [0xdf81615E44b34C7015bF148De30526A4863c0DcD](https://explorer.sirius.lightstreams.io/addr/0xdf81615e44b34c7015bf148de30526a4863c0dcd).

After that users can request more tokens for their accounts contacting Lightstreams Dev Team
either [Telegram](https://t.me/LightstreamsDevelopers) or on the [Discuss forum](https://discuss.lightstreams.network/c/dev)

## Getting started

This application is split into two independent parts:
- [Server](/server/README.md) NodeJS express server connected to Lightstreams node
- [UI](/app/README.md) React application connected to Dashboard server.


### License
[MIT LICENSE](/LICENSE)
