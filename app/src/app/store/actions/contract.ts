import { Injectable } from '@angular/core';
import { ActionsDispatcher } from '../actions-dispatcher';
import { IContract, IPermission } from '../state/contract';
import { LocalService } from '../../services/local-service';
import { ProfileService } from '../../services/profile-service';
import { ContractService } from '../../services/contract-service';
import { Router } from '@angular/router';
import { ISignature } from '../state/signature';
import { DeviceActions } from './device';
import { SessionState } from '../state/session';
import { List } from 'immutable';
import { ServerActions } from './server';

@Injectable()
export class ContractActions {
   static RESET = 'CONTRACT_RESET';

   static PAYING_DEPLOYMENT_FEE = 'CONTRACT_PAYING_DEPLOYMENT_FEE';
   static DEPLOYMENT_FEE_PAID = 'CONTRACT_DEPLOYMENT_FEE_PAID';

   static CREATE = 'CONTRACT_CREATE';
   static CREATED = 'CONTRACT_CREATED';
   static GENERATING_OWNER_KEY = 'CONTRACT_GENERATING_OWNER_KEY';
   static GENERATING_CONTRACT_KEY = 'CONTRACT_GENERATING_CONTRACT_KEY';
   static INITIALIZE_STATE = 'CONTRACT_INITIALIZE_STATE';
   static INITIALIZED_STATE = 'CONTRACT_INITIALIZED_STATE';
   static READY = 'CONTRACT_READY';
   static SIGN = 'CONTRACT_SIGN';
   static SIGNED = 'CONTRACT_SIGNED';
   static ERROR = 'CONTRACT_ERROR';
   static NEW_TERMS = 'CONTRACT_NEW_TERMS';
   static LOADED = 'CONTRACT_LOADED';
   static PERMISSION_GRANTED = 'CONTRACT_PERMISSION_GRANTED';
   static CONTENT_PURCHASED = 'CONTRACT_CONTENT_PURCHASED';
   static TRANSFER_COMPLETE = 'CONTRACT_TRANSFER_COMPLETE';
   static UNLOCK = 'CONTRACT_UNLOCK';
   static UNLOCKED = 'CONTRACT_UNLOCKED';
   static PURCHASED = 'CONTRACT_PURCHASED';

   constructor(private actions: ActionsDispatcher,
               private contract: ContractService,
               private profile: ProfileService,
               private local: LocalService,
               private router: Router,
               private session: SessionState) {
   }

   reset() {
      this.actions.dispatch(ContractActions.RESET);
   }

   unlock(metaAddr: string, signatureId: string) {
      this.actions.dispatch(ContractActions.UNLOCK);

      return new Promise<any>((resolve, reject) => {
         this.local.unlock(metaAddr, signatureId)
            .then((contract) => {
               contract.signatureId = signatureId;
               this.actions.dispatch(ContractActions.LOADED, contract);
               resolve(contract);
            })
            .catch((err) => {
               this.handleError(err);
               reject(err);
            });
      });
   }

   transferOwnership(metaAddr: string, signature: ISignature): Promise<any> {
      let receipt;
      return new Promise<any>((resolve, reject) => {
         this.local.transferOwnership(metaAddr, signature)
            .then((data) => {
               receipt = data;
               return this.local.getContract(signature, metaAddr);
            })
            .then((contract) => {
               this.actions.dispatch(ContractActions.TRANSFER_COMPLETE, receipt);
               this.actions.dispatch(ContractActions.LOADED, contract);
               resolve(receipt);
            })
            .catch((err) => {
               this.handleError(err);
               reject(err);
            });
      });
   }

   getContracts() {
      return new Promise<any>((resolve) => {

         let device = this.session.device;

         if (device.cached) {
            return resolve(device.contracts);
         }

         this.local.getContracts()
            .then((contracts) => resolve(contracts))
            .catch((err) => {
               this.handleError(err);
               resolve();
            });
      });
   }

   // getContentCover(ipfsAddr: string, metaAddr: string) {
   //    return new Promise<string>((resolve) => {
   //       this.local.getContractData(ipfsAddr, metaAddr, 'base64')
   //          .then(data => {
   //             resolve(data);
   //          })
   //          .catch(err => {
   //             this.handleError(err);
   //             resolve();
   //          });
   //    });
   // }

   async search(signature: ISignature, searchQuery: any) {
      let contract;
      let device = this.session.device;
      if (device.cached) {
         let contracts = device.contracts as List<IContract>;
         contract = contracts.find((c) => c.metaAddr === searchQuery.metaAddr);
      }

      if (!contract) {
         contract = await this.local.search(signature, searchQuery);
      }

      if (!contract) {
         return null;
      }

      try {
         let cover = contract.publicStateChain.current.cover;
         if (cover.address && !cover.base64Encoded) {
            let data = await this.local.getIpfsData(cover.address, 'base64');
            console.log('data', data);
            cover.base64Encoded =
               `data:${cover.encoding};base64,${data}`;
         }

         this.actions.dispatch(ContractActions.LOADED, contract);
         this.actions.dispatch(DeviceActions.ADD_CONTRACT, contract);
         return contract;
      } catch (err) {
         this.handleError(err);
         throw err;
      }
   }

   _getContract(signature: ISignature, metaAddr: string): Promise<IContract> {
      let contract;
      let device = this.session.device;
      if (device.cached) {
         return new Promise<IContract>((resolve) => {
            let contracts = device.contracts as List<IContract>;
            contract = contracts.find(c => c.metaAddr === metaAddr);
            this.actions.dispatch(ContractActions.LOADED, contract);
            return resolve(contract);
         });
      }

      return this.local.getContract(signature, metaAddr);
   }

   getContractFromClient(signature: ISignature, metaAddr: string): Promise<IContract> {
      let contract;
      let cover;

      return new Promise<IContract>((resolve) => {
         this.local.getContract(signature, metaAddr)
            .then((c: IContract) => {
               contract = c;
               contract.error = '';
               cover = contract.publicStateChain.current.cover;

               if (cover.address) {
                  return this.local.getIpfsData(cover.address, 'base64')
               }

               this.actions.dispatch(ContractActions.LOADED, contract);
               resolve(contract);
            })
            .then(data => {
               if (data) {
                  cover.base64Encoded = `data:${cover.encoding};base64,${data}`;
               }

               this.actions.dispatch(ContractActions.LOADED, contract);
               resolve(contract);
            })
            .catch((err) => {
               this.handleError(err);
               resolve();
            });
      });
   }

   getContract(signature: ISignature, metaAddr: string): Promise<IContract> {
      let contract;
      let cover;

      return new Promise<IContract>((resolve) => {
         this._getContract(signature, metaAddr)
            .then((c: IContract) => {
               contract = c;
               if (!c) {
                  return resolve(null);
               }
               contract.error = '';
               cover = contract.publicStateChain.current.cover;

               if (cover.address) {
                  return this.local.getIpfsData(cover.address, 'base64');
               }

               resolve(contract);
            })
            .then((data) => {
               if (data) {
                  cover.base64Encoded = `data:${cover.encoding};base64,${data}`;
               }

               this.actions.dispatch(ContractActions.LOADED, contract);
               resolve(contract);
            })
            .catch((err) => {
               this.handleError(err);
               resolve();
            });
      });
   }

   getToken(contract: string, signature: ISignature): Promise<string> {
      return new Promise<string>((resolve, reject) => {
         this.local.getToken(contract, signature)
            .then((token) => {
               resolve(token);
            })
            .catch((err) => {
               this.handleError(err);
               reject(err);
            });
      });
   }

   getPrivateData(signature: ISignature, contract: string, ipfsAddress: string): Promise<any> {
      return new Promise<string>((resolve, reject) => {
         this.local.getToken(contract, signature)
            .then((token) => {
               return this.local.getIpfsDataWithToken(token, contract, ipfsAddress);
            })
            .then((response) => {
               resolve(response);
            })
            .then(() => {
               this.actions.dispatch(ServerActions.REQUEST_COMPLETE);
            })
            .catch((err) => {
               this.handleError(err);
               reject(err);
            });
      });
   }

   createContent(contract: IContract) {
      this.actions.dispatch(ContractActions.CREATE);
      let owner = contract.owner;
      let price = contract.price; // TODO: Price should be returned from server.

      return new Promise<string>((resolve, reject) => {
         this.local.deployContract(contract, 'xxx')
            .then(data => {
               contract = data;
               // TODO: Should Owner info be set from data returned from server?
               contract.owner = owner;
               this.actions.dispatch(ContractActions.CREATED, contract);
               resolve();
            })
            .catch(err => {
               this.handleError(err);
               reject(err);
            });
      });
   }

   createContentWithFee(contract: IContract, deploymentAccount, deploymentPrice) {
      this.actions.dispatch(ContractActions.PAYING_DEPLOYMENT_FEE);
      let owner = contract.owner;
      let price = contract.price; // TODO: Price should be returned from server.

      return new Promise<string>((resolve, reject) => {
         this.local.deployContract(contract, '')
         this.local.sendValue(deploymentAccount, deploymentPrice)
            .then(txReceipt => {
               this.actions.dispatch(ContractActions.CREATE);
               return this.local.deployContract(contract, txReceipt.transactionHash)
            })
            .then(data => {
               contract = data;
               // TODO: Should Owner info be set from data returned from server?
               contract.owner = owner;
               this.actions.dispatch(ContractActions.CREATED, contract);
               resolve();
            })
            .catch(err => {
               this.handleError(err);
               reject(err);
            });
      });
   }

   createContract(contract: IContract) {
      this.actions.dispatch(ContractActions.CREATE);
      let owner = contract.owner;

      return new Promise<string>((resolve, reject) => {
         this.contract.newContract(contract)
            .then(data => {
               contract = data;
               // TODO: Should Owner info be set from data returned from server?
               contract.owner = owner;
               this.actions.dispatch(ContractActions.GENERATING_CONTRACT_KEY);
               return this.local.newContract(contract);
            })
            .then(() => {
               this.actions.dispatch(ContractActions.CREATED, contract);
               resolve();
            })
            .catch((err) => {
               this.handleError(err);
               reject(err);
            });
      });
   }

   initilizeState(contract: IContract): Promise<any> {
      return new Promise<string>((resolve) => {
         this.actions.dispatch(ContractActions.SIGN);
         this.local.setPrice(contract.owner, contract.metaAddr, contract.price)
            .then(() => {
               return this.local.initializeState(contract.owner, contract);
            })
            .then((c) => {
               this.actions.dispatch(ContractActions.SIGNED);
               this.actions.dispatch(DeviceActions.ADD_CONTRACT, c);
            })
            .then(() => {
               this.router.navigate(['/contracts', contract.metaAddr, {isNew: true}]);
            })
            .catch((err) => {
               this.handleError(err);
               resolve();
            });
      });
   }


   setTerms(termsAddr: string) {
      this.actions.dispatch(ContractActions.NEW_TERMS, termsAddr);
   }

   signContract(contract: IContract) {
      return new Promise<string>((resolve) => {
         this.actions.dispatch(ContractActions.SIGN);
         this.local.signContract(contract)
            .then(receipt => {
               this.actions.dispatch(ContractActions.SIGNED, receipt);
            })
            .then(() => {
               this.router.navigate(['/contracts', contract.metaAddr, {isNew: true}]);
            })
            .catch(err => {
               this.handleError(err);
               resolve();
            });
      });
   }

   grantPermission(metaAddr: string, permission: IPermission, clientIPs: string[]) {
      return new Promise<string>((resolve, reject) => {
         this.local.grantPermission(metaAddr, permission, clientIPs)
            .then(permissions => {
               this.actions.dispatch(ContractActions.PERMISSION_GRANTED, permissions);
               resolve();
            })
            .catch(err => {
               this.handleError(err);
               reject(err);
            });
      });
   }

   async purchaseContent(signature: ISignature, metaAddr: string, price: string) {
      try {
         this.actions.dispatch(ContractActions.UNLOCK);
         let data = await this.local.purchaseContent(signature, metaAddr, price);
         this.actions.dispatch(ContractActions.PURCHASED, data.receipt);
         this.actions.dispatch(ContractActions.UNLOCKED, data.contract);
         const state = this.actions.getState();
         this.actions.dispatch(DeviceActions.ADD_CONTRACT, state.contract);
      } catch (err) {
         this.handleError(err);
         throw err;
      }
   }

   setError(error: string) {
      this.handleError(error);
   }

   private handleError(err) {
      this.actions.dispatch(ContractActions.ERROR, err);
      console.log(err);
   }
}
