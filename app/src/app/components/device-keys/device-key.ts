import {Component} from '@angular/core';
import {ProfileActions} from "../../store/actions/profile";
import {
   IProfileRecord, IProfile, IDeviceRecord, IDevice, INITIAL_DEVICE_STATE, DeviceFactory
} from "../../store/state/profile";
import {select} from "ng2-redux";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {List} from "immutable";
import {compareDates} from "../../store/utils";

@Component({
    selector: 'device-key',
    template: require('./device-key.html'),
    styles: [require('./device-key.scss')],
})
export class DeviceKey {
    @select() profile$: Observable<IProfileRecord>;
    @select(state => state.profile.processing) processing$;

    profileSubscription: Subscription;
    profile: IProfile;

    device: IDevice;
    devices: IDevice[];

    constructor(
        private actions: ProfileActions,
        private router: Router) {
        this.resetForm();
    }

    resetForm() {
        this.device = DeviceFactory(INITIAL_DEVICE_STATE).toJS();
    }

    ngOnInit() {
        this.profileSubscription = this.profile$.subscribe(p => {

            let devices = p.devices as List<IDevice>;

            // Sort descending
            let sorted = devices.sort((a: IDeviceRecord, b: IDeviceRecord) =>
               compareDates(b.createdAt, a.createdAt));

            this.devices = sorted.toJS();
        });
    }

    ngOnDestroy() {
        this.profileSubscription.unsubscribe();
    }

    onAdd() {
        this.actions.addDevice(this.device)
           .then(() => {
               this.resetForm();
           })
    }
}
