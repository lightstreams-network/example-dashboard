/*
 * Angular 2 decorators and services
 */
import {
   Component,
   OnInit,
   ViewEncapsulation, Inject
} from '@angular/core';
import {DevToolsExtension, NgRedux, select} from 'ng2-redux';
import {IAppState, reimmutify, INITIAL_STATE} from './store/app-state';
import {NgReduxRouter} from 'ng2-redux-router';
import {enhancers} from './store/enhancers';
import {Environment} from './environment';
import {rootReducer} from './store/root-reducer';
import {middleware} from './store/middleware';
import {AppActions} from "./store/actions/app";
import {SessionState} from "./store/state/session";

/*
 * App Component
 * Top Level Component
 */
@Component({
   selector: 'app',
   encapsulation: ViewEncapsulation.None,
   styleUrls: [
      './app.component.scss'
   ],
   templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
   //@select(s => s.profile.pictureUrl) pictureUrl;

   @select() profile$;

   navItems: any;

   profile: any;

   showProfilePicture: boolean;

   constructor(private ngReduxRouter: NgReduxRouter,
               private session: SessionState,
               private actions: AppActions) {

      if (Environment.CLIENT_MODE) {
         this.navItems = [
            //{name: 'Create Profile', route: 'create-profile'},
            {name: 'Search', route: 'search'},
            {name: 'Library', route: 'contracts'},
            {name: 'Publish', route: 'publish-content'},
         ];
      } else {
         this.navItems = [
            {name: 'Register Device', route: 'device-key'},
         ];
      }
   }

   public ngOnInit() {
      this.ngReduxRouter.initialize();
      this.actions.reset();

      $("body").addClass("loaded");

      console.log('Version 0.0.1');

      this.profile$.subscribe(p => {
         this.profile = p.toJS();
         if (this.profile.pictureUrl.length > 0) {
            this.showProfilePicture = true;
         }
      });
   }

   logout() {
      this.actions.logout();
   }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
