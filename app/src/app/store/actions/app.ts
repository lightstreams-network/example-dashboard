import {Injectable} from "@angular/core";
import {ActionsDispatcher} from "../actions-dispatcher";
import {UpholdService} from "../../services/uphold-service";
import {UpholdActions} from "./uphold";
import {SessionService} from "../../services/session.service";
import {LocalService} from "../../services/local-service";
import {BlockchainActions} from "./blockchain";
import {DeviceActions} from "./device";
import {ProfileService} from "../../services/profile-service";
import { SignatureFactory } from '../state/signature';

@Injectable()
export class AppActions {
   static LOGOUT = 'APP_LOGOUT';
   static RESET = 'APP_RESET';
   static SYSTEM_ERROR = 'APP_SYSTEM_ERROR';
   static TOKEN = 'SESSION_TOKEN';
   static LOCAL_TOKEN = 'SESSION_LOCAL_TOKEN';
   static DEVICE_NOT_VALIDATED = 'SESSION_DEVICE_NOT_VALIDATED';
   static CHANGE_DEVICE = 'APP_CHANGE_DEVICE';

   private authState: string;

   constructor(private actions: ActionsDispatcher,
               private session: SessionService,
               private local: LocalService,
               private profile: ProfileService,
               private uphold: UpholdService) {
   }

   getInitConfig(): Promise<any> {
      return new Promise<any>((resolve, reject) => {
         let device;
         let signature = SignatureFactory({}).toJS();

         this.local.getMachineConfig()
            .then((data: any) => {
               signature.account = data.defaultAccount;
               signature.publicKey = data.defaultPublicKey;
               signature.signatureId = data.defaultSignatureId;
               device = {
                  deviceId: data.deviceId,
                  defaultSignature: signature,
                  lightClient: false, //data.lightClient, (@TODO Undo)
                  localhost: data.localhost,
                  deploymentAccount: data.deploymentAccount,
                  deploymentPrice: data.deploymentPrice
               };

               this.actions.dispatch(AppActions.CHANGE_DEVICE, device);
               this.actions.dispatch(BlockchainActions.LOCAL_CONFIG, data.ethereum);

               resolve(device);
            })
            .catch(err => {
               this.handleError(err);
               reject(null);
            });
      });
   }

   setAuthState(state: string) {
      this.authState = state;
   }

   setToken(token: string) {
      this.actions.dispatch(AppActions.TOKEN, {token: token});
   }

   getToken(): Promise<string> {
      return new Promise<string>((resolve, reject) => {
         this.session.getToken(this.authState)
            .then(data => {
               this.actions.dispatch(AppActions.TOKEN, {token: data.token});
               resolve();
            })
            .catch(err => {
               this.handleError(err);
               this.logout();
            });
      });
   }

   generateToken(device: any): Promise<string> {
      return new Promise<string>((resolve, reject) => {
         this.local.generateToken("")
            .then(data => {
               this.actions.dispatch(AppActions.LOCAL_TOKEN, {localToken: data.token});

               let req = {
                  token: data.token,
                  localhost: device.localhost
               };
               return this.session.validateLocalToken(req);
            })
            .then(data => {
               this.actions.dispatch(AppActions.TOKEN, {token: data.token});
               resolve();
            })
            .catch(err => {
               this.actions.dispatch(AppActions.DEVICE_NOT_VALIDATED);
               this.handleError(err);
               reject();
            });
      });
   }

   logout() {
      this.uphold.logout()
         .then(result => this.actions.dispatch(UpholdActions.LOG_OUT))
         .then(() => window.location.href = '/login')
         .catch(err => this.handleError(err));
   }

   resetDemo() {
      localStorage.clear();

      console.log("local storage cleared");
      window.location.href = '';
   }

   reset() {
      this.actions.dispatch(AppActions.RESET);
   }

   handleError(err) {
      console.log(err);
   }
}
