import {Component} from '@angular/core';
import {ProfileActions} from "../../store/actions/profile";
import {IProfileRecord, IProfile, IDevice} from "../../store/state/profile";
import {select} from "ng2-redux";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import { ClientModes, Environment } from "../../environment";

@Component({
    selector: 'home',
    template: require('./home.html'),
    styles: [require('./home.scss')],
})
export class HomeComponent {
    @select() profile$: Observable<IProfileRecord>;

    profileSubscription: Subscription;
    profile: IProfile;

    deviceRegistered: boolean;
    devices: IDevice[] = [];

    constructor(
        private actions: ProfileActions,
        private router: Router) {
    }

    ngOnInit() {
        if (Environment.CLIENT_MODE !== ClientModes.SERVER) {
            return this.router.navigate(['create-asset']);
        }

        this.profileSubscription = this.profile$.subscribe(p => {
            this.profile = p.toJS();

            this.devices = this.profile.devices as IDevice[];

            if (this.devices.length > 0) {
                this.deviceRegistered = true;
            }
        });
    }

    ngOnDestroy() {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }

    onRegisterDevice() {
        this.router.navigate(['device-key'])
    }

}
