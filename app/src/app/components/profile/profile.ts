import {Component} from '@angular/core';
import {ProfileActions} from "../../store/actions/profile";
import {IProfileRecord, IProfile} from "../../store/state/profile";
import {select} from "ng2-redux";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'profile',
    template: require('./profile.html'),
    styles: [require('./profile.scss')],
})
export class Profile {
    @select() profile$: Observable<IProfileRecord>;
    @select(state => state.profile.processing) processing$;

    profileSubscription: Subscription;
    profile: IProfile;

    constructor(
        private actions: ProfileActions,
        private router: Router) {
    }

    ngOnInit() {
        this.profileSubscription = this.profile$.subscribe(p => {
            this.profile = p.toJS();
        });
    }

    ngOnDestroy() {
        this.profileSubscription.unsubscribe();
    }

    onSave() {
        this.actions.saveProfile(this.profile)
            .then(() => {
                this.router.navigate([''])
            });
    }
}
