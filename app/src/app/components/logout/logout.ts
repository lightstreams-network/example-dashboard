import {Component} from '@angular/core';
import {AppActions} from "../../store/actions/app";

@Component({
    selector: 'logout',
    template: require('./logout.html'),
    styles: [require('./logout.scss')],
})
export class LogoutComponent {

    constructor(
       private actions: AppActions) {

    }

    ngOnInit() {
       //this.actions.resetDemo();
    }

    reset() {
       this.actions.resetDemo();

    }

}
