var mongoose = require('mongoose');

var Signature = new mongoose.Schema({
   signatureId: String,
   type: String,
   account: String,
   publicKey: String
});

var Meta = new mongoose.Schema({
   name: String,
   version: String,
   blockchain: String,
   compiler: String,
   creator: String,
   issuer: String,
   address: String
});

var Header = new mongoose.Schema({
   name: String,
   description: String,
   contractType: String,
   creator: {type: Signature, default: {}},
   issuer: {type: Signature, default: {}},
   owner: {type: Signature, default: {}},
   counterparty: {type: Signature, default: {}}
});

var Permission = new mongoose.Schema({
   signatureId: String,
   capabilities: {type: [String], default: []},
   createdAt: Date,
   updatedAt: Date
});

var Transaction = new mongoose.Schema({
   blockHash: String,
   blockNumber: String,
   transactionHash: String,
   transactionIndex: Number,
   createdAt: Date
});

var Contract = new mongoose.Schema({
   contractId: String,
   metaAddr: String,
   meta: {type: Meta, default: {}},
   header: {type: Header, default: {}},
   termsAddr: String,
   mediaAddr: String,
   transactions: {type: [Transaction], default: []},
   permissions: {type: [Permission], default: []},
   createdAt: Date,
   updatedAt: Date
});

Contract.statics.Create = (data, cb) => {
   let transaction = {
      blockHash: data.contract,
      blockNumber: data.blockNumber,
      transactionHash: data.transactionHash,
      transactionIndex: data.transactionIndex
   };

   let contract = new Contract(data);
   contract.transactions = [transaction];

   contract.save(cb);
};

Contract.statics.findByContractId = function (contractId, cb) {
   return this.findOne({contractId}, cb);
};

Contract.statics.findByMetaAddr = function (metaAddr, cb) {
   return this.findOne({metaAddr}, '-_id -issuer._id -owner._id -counterparty._id -creator', cb);
};

mongoose.model('contracts', Contract);
