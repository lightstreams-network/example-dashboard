import {
   Routes,
   Resolve,
   ActivatedRouteSnapshot,
   RouterStateSnapshot
} from '@angular/router';

import { NoContentComponent } from './no-content';
import { DeviceKey } from './components/device-keys/device-key';
import { Injectable } from '@angular/core';
import { ProfileActions } from './store/actions/profile';
import { HomeComponent } from './components/home/home';
import { SessionState } from './store/state/session';
import { ClientModes, Environment } from './environment';
import { LocalHomeComponent } from './components/local-home/local';
import { AppActions } from './store/actions/app';
import { BlockchainActions } from './store/actions/blockchain';
import { LogoutComponent } from './components/logout/logout';
import { DeviceActions } from './store/actions/device';
import { ContractActions } from './store/actions/contract';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';
import { IContract } from './store/state/contract';
import { CreateContentComponent } from './components/create-content/create-content';
import { ContractSearch } from './contracts/search/contract-search';
import { IDevice } from './store/state/device';
import { ActionsDispatcher } from './store/actions-dispatcher';
import { SignatureFactory } from './store/state/signature';

let routes: any;

if (Environment.CLIENT_MODE !== ClientModes.SERVER) {
   routes = [
      {
         path: '',
         component: LocalHomeComponent,
         resolve: {
            profile: 'profileResolver'
         }
      },
      {
         path: 'publish-content',
         component: CreateContentComponent,
         resolve: {
            profile: 'profileResolver'
         }
      },
      {
         path: 'search',
         component: ContractSearch,
      },
      {path: 'reset', component: LogoutComponent},
      {path: '**', component: NoContentComponent},
   ];
} else {
   routes = [
      {
         path: '',
         component: HomeComponent,
         resolve: {
            profile: 'profileResolver'
         }
      },
      {
         path: 'device-key',
         component: DeviceKey,
         resolve: {
            profile: 'devicesResolver'
         }
      },
      //{path: 'contract-design', component: ContractDesign},
      //{path: 'uphold-pay', component: UpholdPay},
      {path: 'logout', component: LogoutComponent},
      {path: '**', component: NoContentComponent},
   ];
}

export const ROUTES: Routes = routes;

@Injectable()
export class ProfileResolver implements Resolve<any> {
   constructor(private actions: ActionsDispatcher,
               private profile: ProfileActions,
               private appActions: AppActions,
               private deviceActions: DeviceActions,
               private blockchain: BlockchainActions,
               private session: SessionState) {
   }

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
      return new Promise<any>((resolve) => {
         if (this.session.profileLoaded) {
            // Profile has already been loaded.
            return resolve();
         }

         let device = this.session.device;

         switch (Environment.CLIENT_MODE) {
            case ClientModes.LOCAL:
               this.appActions.getInitConfig()
                  .then(() => {
                     return this.deviceActions.getBalance(device.defaultSignature.account);
                  })
                  .then(() => {
                     this.session.profileLoaded = true;
                     resolve();
                  })
                  .catch(() => {
                     resolve();
                  });
               break;

            case ClientModes.REMOTE: {
               if (device.cached) {
                  return resolve();
               }


               this.appActions.getInitConfig()
                  .then(d => {
                     device = d;

                     let signature = SignatureFactory({clientSide: true}).toJS();
                     return this.deviceActions.newSignature(signature);
                  })
                  .then(signature => {
                     // TODO: SignatureId is set to publicKey for web-demo this needs to be changed?
                     signature.signatureId = signature.publicKey;
                     device.defaultSignature = signature;
                     device.cached = true;
                     this.actions.dispatch(AppActions.CHANGE_DEVICE, device);
                     resolve();
                  })
                  .catch(() => {
                     resolve();
                  });
               break;
            }

            case ClientModes.SERVER:
               if (this.session.authenticated()) {
                  return resolve();
               }

               this.appActions.getToken()
                  .then(() => {
                     return this.profile.getProfile();
                  })
                  .then(() => {
                     return this.profile.getDevices();
                  })
                  .then(() => {
                     resolve();
                  })
                  .catch(() => {
                     resolve();
                  });
               break;

            default:
               break;
         }
      });
   }
}

@Injectable()
export class DevicesResolver implements Resolve<any> {
   constructor(private actions: ProfileActions) {
   }

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
      return new Promise<any>((resolve) => {
         this.actions.getDevices()
            .then(() => resolve())
            .catch(() => resolve());
      });
   }
}

@Injectable()
export class SignaturesResolver implements Resolve<any> {
   constructor(private actions: DeviceActions) {
   }

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
      return new Promise<any>((resolve) => {
         this.actions.getSignatures()
            .then(() => resolve())
            .catch(() => resolve());
      });
   }
}

@Injectable()
export class ContractsResolver implements Resolve<any> {
   constructor(
      private actions: ContractActions) {
   }

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
      return this.actions.getContracts();
   }
}

@Injectable()
export class ContractResolver implements Resolve<any> {
   @select(['contract']) contract$: Observable<any>;
   @select() device$: Observable<IDevice>;

   contract: IContract;
   device: IDevice;

   constructor(private actions: ContractActions) {

      this.contract$.subscribe(c => this.contract = c);
      this.device$.subscribe((d: any) => this.device = d.toJS());
   }

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
      let params: any = route.params;
      let metaAddr = params.id;

      if (this.contract.metaAddr === metaAddr && this.contract.loaded) {
         return new Promise<any>(resolve => resolve(this.contract));
      }

      let signature = this.device.defaultSignature;

      return this.actions.getContract(signature, metaAddr);
   }
}

