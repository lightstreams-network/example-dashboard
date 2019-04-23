'use strict';

const request = require('request');
const config = require('../config');
const async = require('async');
const mongoose = require('mongoose');
const Account = mongoose.model('accounts');
const Contract = mongoose.model('contracts');
const crypto = require('crypto');

export class ContractService {
   /*
   getNonce(signatureId: string, cb: any) {
      this.getSignature(signatureId, (err, signature) => {
         if (err) {
            return cb(err);
         }

         let url = 'nonce/' + signature.publicKey;
         this.get(url, cb);
      });
   }
   */

   getNonce(message, cb) {
      let url = '/account/nonce';
      this.send(url, 'POST', message, (err, result) => {
         console.log('nonce res:');
         console.log(result);
         cb(err, result);
      });
   }

   transact(message, cb) {
      let url = '/contract/transact';
      this.send(url, 'POST', message, (err, result) => {
         console.log('transact res:');
         console.log(result);
         cb(err, result);
      });
   }

   call(message, cb) {
      let url = '/contract/call';
      this.send(url, 'POST', message, (err, result) => {
         console.log('call res:');
         console.log(result);
         cb(err, result);
      });
   }

   createContract(data, cb) {
      let response;

      let streams = [];
      streams.push(next => {
         this.generateContractId(next);
      });

      streams.push((contractId, next) => {
         data.contractId = contractId;
         this.post('/contract', data, next);
      });

      streams.push((contract, next) => {
         response = contract;
         let model = new Contract(contract);

         let transaction = {
            blockHash: contract.blockHash,
            blockNumber: contract.blockNumber,
            transactionHash: contract.transactionHash,
            transactionIndex: contract.transactionIndex
         };

         model.transactions.push(transaction);
         model.save(next);
      });

      async.waterfall(streams, err => {
         if (err) {
            return cb(`Could not create contract. ${err}`)
         }

         cb(null, response);
      });
   }

   getContract(metaAddr: string, requester: any, cb: any) {
      let contract;

      let streams = [];
      streams.push(next => {
         Contract.findByMetaAddr(metaAddr, next);
      });

      streams.push((data, next) => {
         contract = data;
         if (!contract) {
            return next('No contract found');
         }

         contract = contract.toObject();
         if (contract.transactions.length > 0) {
            contract.blockNumber = contract.transactions[0].blockNumber;
         }

         Account.findUserBySignature(contract.owner.signatureId, next);
      });

      streams.push((contractOwner, next) => {
         if (contractOwner.id !== requester.id) {
            // requester does not own contract.
            // Do not reveal signatures.
            return cb(null, contract);
         }

         this.populateSignatures(contract.permissions, next)
      });

      async.waterfall(streams, err => {
         if (err) {
            return cb(`No contract found for meta address ${metaAddr}. ${err}`)
         }

         cb(null, contract);
      });
   }

   getSignature(signatureId: string, cb: any) {
      Account.findSignature(signatureId, (err, signature) => {
         if (!signature) {
            let err = 'could not find owner signature ' + signatureId;
            return cb(err);
         }
         if (!signature.publicKey) {
            return cb('Invalid signature. No public key for signature ID: ' + signatureId);
         }

         cb(null, signature);
      });
   }

   grantPermission(metaAddr: string, ownerAccount: any, permission: any, cb) {
      let signatureId = permission.signature && permission.signature.signatureId || null;
      if (!signatureId) {
         return cb('No signatureId given in grant permission request.');
      }

      let capabilities = permission.capabilities;

      let contract;
      let streams = [];
      streams.push(next => {
         Contract.findOne({metaAddr}, next);
      });

      streams.push((data, next) => {
         contract = data;
         if (!contract) {
            return next('No contract found');
         }

         Account.findUserBySignature(contract.owner.signatureId, next);
      });

      streams.push((account, next) => {
         if (!account) {
            return next('No account found that owns contract');
         }

         if (account.id !== ownerAccount.id) {
            return next('requester does not own the contract');
         }

         let permissions = contract.permissions.filter(c => c.signatureId === signatureId);
         if (permissions.length === 0) {
            permission = {signatureId, capabilities};
            contract.permissions.push(permission);
         } else {
            permissions[0].capabilities = capabilities;
         }

         contract.save((err, account) => {
            next(err);
         });
      });

      streams.push(next => {
         let permissions = contract.permissions.toObject();
         this.populateSignatures(permissions, next)
      });

      async.waterfall(streams, (err, permissions) => {
         if (err) {
            return cb(`grant permission fail for contract ${metaAddr}. ${err}`)
         }

         cb(null, permissions);
      });
   }

   populateSignatures(permissions, cb) {
      async.each(permissions, (permission, next) => {
         let signatureId = permission.signatureId;
         Account.findUserBySignature(signatureId, (err, account) => {
            if (err) {
               return next(err);
            }
            if (!account) {
               return next(null);
            }
            let profile = account.profile;
            let signature = account.signatures[0].toObject();
            signature.name = `${profile.firstName} ${profile.lastName}`;
            delete signature._id;
            delete permission.signatureId;
            permission.signature = signature;
            next(null);
         });
      }, (err) => {
         cb(err, permissions);
      });
   }

   get(url: string, cb: any) {
      this.send(url, 'GET', null, cb);
   }

   post(url: string, message, cb: any) {
      this.send(url, 'POST', message, cb);
   }

   private send(url: string, method: string, message: any, cb: any) {
      url = config.REGISTRY_URL + url;

      console.log('sending request: ' + url);
      if (message) {
         console.log('message:');
         console.log(message);
         message = JSON.stringify(message);
      }

      let options = {
         url: url,
         method: method,
         headers: {
            'content-type': 'application/json'
         },
         body: message
      };

      request(options, (err, res, body) => {
         let errorMessage = 'An error occurred calling contracts service: ';
         if (err) {
            errorMessage = errorMessage + err;
            console.log(errorMessage);
            return cb(errorMessage);
         }
         if (res.statusCode !== 200) {
            errorMessage = errorMessage + `status code ${res.statusCode} ${res.body}`;
            console.log(errorMessage);
            return cb(errorMessage);
         }
         let contract = null;
         try {
            console.log("body:");
            console.log(body);
            contract = JSON.parse(body);
         } catch (e) {
            errorMessage = 'could not parse response message for request to url ' + url;
            console.log(errorMessage);
            return cb(errorMessage);
         }

         cb(null, contract);
      });
   }

   generateContractId(cb) {
      let contractId = this.randomAsciiString(8);
      let genCount = 0;
      genCount ++;

      if (genCount > 5) {
         return cb('Could not generate a contractId after 5 attempts');
      }

      Contract.findByContractId(contractId, (err, account) => {
         if (err) {
            return cb(err);
         }

         if (account) {
            return this.generateContractId(cb);
         }

         cb(null, contractId);
      });
   }

   randomAsciiString(length) {
      return this.randomString(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
   }


   randomString(length, chars) {
      if (!chars) {
         throw new Error('Argument \'chars\' is undefined');
      }

      var charsLength = chars.length;
      if (charsLength > 256) {
         throw new Error('Argument \'chars\' should not have more than 256 characters'
            + ', otherwise unpredictability will be broken');
      }

      var randomBytes = crypto.randomBytes(length);
      var result = new Array(length);

      var cursor = 0;
      for (var i = 0; i < length; i++) {
         cursor += randomBytes[i];
         result[i] = chars[cursor % charsLength];
      }

      return result.join('');
   }
}
