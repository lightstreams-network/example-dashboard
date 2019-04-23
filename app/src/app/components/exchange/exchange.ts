import {Component} from '@angular/core';
import {ProfileActions} from "../../store/actions/profile";
import {IProfileRecord, IProfile} from "../../store/state/profile";
import {select} from "ng2-redux";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'exchange',
    template: require('./exchange.html'),
    styles: [require('./exchange.scss')],
})
export class ExchangeComponent {
    @select() profile$: Observable<IProfileRecord>;

    profileSubscription: Subscription;
    profile: IProfile;

    constructor(
        private actions: ProfileActions,
        private router: Router) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        // this.profileSubscription.unsubscribe();
    }

}
