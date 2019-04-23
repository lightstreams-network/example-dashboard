var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// see: https://www.npmjs.com/package/passport-local-mongoose
var passportLocalMongoose = require('passport-local-mongoose');

var Device = new mongoose.Schema({
   name: String,
   publicKey: String,
   ipAddress: String,
   createdAt: Date,
   updatedAt: Date
});

var Signature = new mongoose.Schema({
   signatureId: String,
   type: String,
   account: String,
   publicKey: String,
   createdAt: Date
});

var Account = new Schema({
   initial_eth: Boolean, default: false,
   profile: {
      username: String,
      firstName: String,
      lastName: String,
      pictureUrl: String,
      publicKey: String
   },
   signatures: {type: [Signature], default: []},
   devices: {type: [Device], default: []},
   session: {
      auth_state: String,
      token: {
         access_token: String,
         token_type: String,
         refresh_token: String,
         expires_in: Date
      }
   },
   uphold: {
      auth_state: String,
      redirect: String,
      token: {
         access_token: String,
         token_type: String,
         refresh_token: String,
         expires_in: Date,
         scope: String
      }
   },
   docusign: {
      auth_state: String,
      redirect: String,
      token: {
         access_token: String,
         token_type: String,
         refresh_token: String,
         expires_in: Number,
         user_api: String
      }
   },
   linkedIn: {
      id: String,
      headline: String,
      industry: String,
      numConnections: Number,
      pictureUrl: String,
      publicProfileUrl: String
   }
});

Account.statics.findOrCreate = function (username, cb) {
   this.findOne({username: username}, (err, account) => {
      if (account) {
         return cb(null, account);
      }

      this.create({username: username}, cb);
   });
};

Account.statics.findUser = function (username, cb) {
   return this.findOne({username: username}, cb);
};

Account.statics.findUserByLinkedInId = function (id, cb) {
   return this.findOne({'linkedIn.id': id}, cb);
};

Account.statics.findUserBySessionState = function (auth_state, cb) {
   return this.findOne({'session.auth_state': auth_state}, cb);
}

Account.statics.findUserByDocusignState = function (auth_state, cb) {
   return this.findOne({'docusign.auth_state': auth_state}, cb);
};

Account.statics.findUserByUpholdState = function (auth_state, cb) {
   return this.findOne({'uphold.auth_state': auth_state}, cb);
};

Account.statics.findUserBySignature = function (signatureId, cb) {
   return this.findOne({'signatures.signatureId': signatureId}, cb);
};

Account.statics.findSignature = function (signatureId, cb) {
   return this.findOne({"signatures.signatureId": signatureId}, {
         signatures: {
            $elemMatch: {
               signatureId: signatureId
            }
         }
      },
      (err, account) => {
         if (err) {
            return cb(err);
         }
         if (!account) {
            return cb('could not find an account with signatureId: ' + signatureId);
         }
         cb(null, account.signatures[0]);
      });
};

Account.statics.update = function (id, account, cb) {
   this.findByIdAndUpdate(id, {$set: account}, {new: true}, cb);
};

Account.statics.addDevice = function (id, device, cb) {
   this.findById(id, (err, account) => {
      if (err) {
         return cb(err);
      }

      if (account.devices.length >= 10) {
         return cb('A maximum of 10 devices is permitted.');
      }

      device.createdAt = new Date();
      device.updatedAt = new Date();

      account.devices.push(device);

      account.save((err) => {
         cb(err, device);
      });
   });
};

Account.statics.addSignature = function (id, signature, cb) {
   this.findById(id, (err, account) => {
      if (err) {
         return cb(err);
      }

      if (account.signatures.length >= 100) {
         return cb('A maximum of 100 signatures is permitted.');
      }

      account.signatures.push(signature);

      account.save(cb);
   });
};

Account.plugin(passportLocalMongoose);

mongoose.model('accounts', Account);
