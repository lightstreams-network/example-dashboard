import {Injectable} from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {IAppState} from '../app-state';
import {UpholdService} from '../../services/uphold-service';
import {ActionsDispatcher} from '../actions-dispatcher';
import {ProfileService} from "../../services/profile-service";
import {IProfile, IDevice} from "../state/profile";
import {SessionState} from "../state/session";
import {ISignature, SignatureFactory} from "../state/signature";

@Injectable()
export class ProfileActions {
    static UPDATE = 'PROFILE_UPDATE';
    static GET_DEVICES = 'PROFILE_GET_DEVICES';
    static ADD_DEVICE = 'PROFILE_ADD_DEVICE';

    constructor(private actions: ActionsDispatcher,
                private service: ProfileService,
                private session: SessionState) {
    }

    getProfile(): Promise<IProfile> {
        return new Promise<IProfile>((resolve, reject) => {
            this.service.getProfile()
                .then(profile => {
                    this.session.profileLoaded = true;
                    this.actions.dispatch(ProfileActions.UPDATE, profile);
                    resolve(profile);
                })
                .catch(err => {
                    this.handleError(err);
                    reject();
                });
        });
    }

    saveProfile(profile: IProfile): Promise<any> {
        this.actions.dispatch(ProfileActions.UPDATE, profile);
        return this.service.save(profile)
            .catch(err => this.handleError(err));
    }

    getDevices(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.service.getDevices()
                .then(devices => {
                    this.actions.dispatch(ProfileActions.GET_DEVICES, devices);
                    resolve();
                })
                .catch(err => {
                    this.handleError(err);
                    resolve();
                });
        });
    }

    addDevice(device: IDevice): Promise<any> {
        return new Promise<any>(resolve => {
            this.service.addDevice(device)
               .then(device => {
                   this.actions.dispatch(ProfileActions.ADD_DEVICE, device);
                   resolve();
               })
               .catch(err => {
                   this.handleError(err);
                   resolve();
               });
        });
    }

    getSignature(signatureId: string): Promise<any> {
        return new Promise<any>(resolve => {
            this.service.getSignature(signatureId)
               .then(data => {
                   if (!data) {
                       return resolve(null);
                   }

                  data.signature = SignatureFactory(data.signature).toJS();
                  resolve(data);
               })
               .catch(err => {
                   this.handleError(err);
                   resolve(null);
               });
        });
    }

    handleError(err) {
        console.log(err);
    }
}
