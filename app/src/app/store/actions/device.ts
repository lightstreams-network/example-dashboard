import {Injectable} from "@angular/core";
import {ActionsDispatcher} from "../actions-dispatcher";
import {UpholdService} from "../../services/uphold-service";
import {UpholdActions} from "./uphold";
import {SessionService} from "../../services/session.service";
import {LocalService} from "../../services/local-service";
import {BlockchainActions} from "./blockchain";
import {ISignature} from "../state/signature";
import {ProfileService} from "../../services/profile-service";

@Injectable()
export class DeviceActions {
    static NEW_SIGNATURE = 'DEVICE_NEW_SIGNATURE';
    static ADD_SIGNATURES = 'DEVICE_ADD_SIGNATURES';
    static ADD_CONTRACT = 'ADD_CONTRACT';
    static GET_BALANCE = 'DEVICE_GET_BALANCE';

    constructor(private actions: ActionsDispatcher,
                private profile: ProfileService,
                private local: LocalService) {
    }

    getSignatures(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.local.getSignatures()
               .then(data => {
                   this.actions.dispatch(DeviceActions.ADD_SIGNATURES, data);
                   resolve();
               })
               .catch(err => {
                   this.handleError(err);
                   reject();
               });
        });
    }

    /*getBalance(account: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.profile.getBalance(account)
                .then(data => {
                    this.actions.dispatch(DeviceActions.GET_BALANCE, data.balance);
                    resolve(data.balance);
                })
                .catch(err => {
                    this.handleError(err);
                    reject();
                });
        });
    }*/

   getBalance(account: string): Promise<string> {
      return new Promise<string>((resolve, reject) => {
         this.local.getBalance(account)
            .then(data => {
               this.actions.dispatch(DeviceActions.GET_BALANCE, data.balance);
               resolve(data.balance);
            })
            .catch(err => {
               this.handleError(err);
               reject();
            });
      });
   }

   newSignature(signature: ISignature): Promise<any> {
      return new Promise<any>((resolve, reject) => {
         this.local.newSignature(signature)
            .then(data => {
               return resolve(data);
            })
            .catch(err => {
               this.handleError(err);
               reject();
            });
      });
   }

    createSignature(signature: ISignature): Promise<any> {
       return new Promise<any>((resolve, reject) => {
          this.local.newSignature(signature)
             .then(data => {
                signature.publicKey = data.publicKey;
                signature.account = data.account;
                return this.profile.addSignature(signature);
             })
             .then(data => {
                signature.signatureId = data.signatureId;
                return this.local.updateSignature(signature);
             })
             .then(() => {
                this.actions.dispatch(DeviceActions.NEW_SIGNATURE, signature);
                resolve(signature);
             })
             .catch(err => {
                this.handleError(err);
                reject();
             });
       });
    }

    handleError(err) {
        console.log(err);
    }
}
