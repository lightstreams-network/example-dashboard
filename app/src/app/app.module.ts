import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, FormBuilder, NG_VALIDATORS} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {
   NgModule,
   ApplicationRef, Inject
} from '@angular/core';
import {
   removeNgStyles,
   createNewHosts,
   createInputTransfer
} from '@angularclass/hmr';
import {
   RouterModule,
   PreloadAllModules
} from '@angular/router';
// Material 2
import {MaterialModule, MdIconRegistry} from '@angular/material';
import {ContractDesign} from './components/contract/contract-design';
import 'hammerjs';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ClientModes, ENV_PROVIDERS, Environment } from './environment';
import {
   ROUTES, ProfileResolver, DevicesResolver, SignaturesResolver, ContractsResolver,
   ContractResolver
} from './app.routes';
// App is our top level component
import {AppComponent} from './app.component';
import {APP_RESOLVER_PROVIDERS} from './app.resolver';
import {AppState, InternalStateType} from './app.service';
import {NoContentComponent} from './no-content';
import {LoginComponent} from './login/login.component';
import {UpholdPay} from './components/uphold/uphold-pay';
import {Docusign} from './components/docusign';
import {CommercialsEditor} from './components/commercials-editor';
import {UploadCard} from './components/contract/upload-card';
import {Hot} from './components/hot';
import {TransactionsEditor} from './components/transactions-editor';
import {InvoicesEditor} from './components/invoices-editor';
import {InvoiceCard} from './components/contract/invoice-card';
import {DocusignCard} from './components/contract/docusign-card';
import {SafePipe} from './pipes/safe-pipe';
import {InvoiceTempateWizard} from './components/invoice-template/invoice-template-wizard';
import {DropdownModule} from 'primeng/components/dropdown/dropdown';
import {FileUploadModule} from 'primeng/components/fileupload/fileupload';
import {ActionsDispatcher} from './store/actions-dispatcher';
import {UpholdService} from './services/uphold-service';
import {UpholdActions} from './store/actions/uphold';
import {DocusignService} from './services/docusign-service';
import {DocusignActions} from './store/actions/docusign';
import {SessionState} from './store/state/session';
import {NgRedux, DevToolsExtension} from 'ng2-redux';
import {NgReduxRouter} from 'ng2-redux-router';
import {ProfileActions} from "./store/actions/profile";
import {ProfileService} from "./services/profile-service";
import {DeviceKey} from "./components/device-keys/device-key";
import {AppActions} from "./store/actions/app";
import {SessionService} from "./services/session.service";
import {IAppState, INITIAL_STATE, reimmutify} from "./store/app-state";
import {rootReducer} from "./store/root-reducer";
import {middleware} from "./store/middleware";
import {enhancers} from "./store/enhancers";
import {HomeComponent} from "./components/home/home";
import {CreateAssetComponent} from "./components/create-asset/create-asset";
import {LocalHomeComponent} from "./components/local-home/local";
import {LocalService} from "./services/local-service";
import {BlockchainActions} from "./store/actions/blockchain";
import {ConsensusService} from "./services/consensus-service";
import {LocalServer} from "./services/server/local-server";
import {AppServer} from "./services/server/app-server";
import {MachineServer} from "./services/server/machine-server";
import {LogoutComponent} from "./components/logout/logout";
import {SignatureStoreComponent} from "./components/signature-store/signature-store";
import {DeviceActions} from "./store/actions/device";
import {ContractActions} from "./store/actions/contract";
import {ContractsModule} from "./contracts/contracts.module";
import {CommonModule} from "./common/common.module";
import {ContractService} from "./services/contract-service";
import {RemoteClient} from "./services/server/remote-client";
import {CreateProfileComponent} from "./components/create-profile/create-profile";
import {CreateInsuranceComponent} from "./components/create-insurance/create-insurance";
import {CreateContentComponent} from "./components/create-content/create-content";
import {ForbiddenValidatorDirective} from "./_directives/forbidden-name.directive";
import {PositiveNumberValidatorDirective} from "./_directives/positive-number.directive";
import {SelectionRequiredDirective} from "./_directives/selection-required.directive";

// Application wide providers
const APP_PROVIDERS = [
   ...APP_RESOLVER_PROVIDERS,
   FormBuilder,
   NgRedux,
   NgReduxRouter,
   MdIconRegistry,
   DevToolsExtension,
   AppState,
   ActionsDispatcher,
   LocalServer,
   AppServer,
   MachineServer,
   UpholdService,
   UpholdActions,
   ProfileActions,
   ProfileService,
   SessionService,
   DocusignService,
   LocalService,
   DocusignActions,
   SessionState,
   AppActions,
   DeviceActions,
   ConsensusService,
   BlockchainActions,
   ContractActions,
   ContractService,
   RemoteClient,
];

type StoreType = {
   state: InternalStateType,
   restoreInputValues: () => void,
   disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
   bootstrap: [AppComponent],
   declarations: [
      AppComponent,
      HomeComponent,
      LogoutComponent,
      LocalHomeComponent,
      CreateAssetComponent,
      CreateContentComponent,
      CreateProfileComponent,
      CreateInsuranceComponent,
      NoContentComponent,
      LoginComponent,
      SignatureStoreComponent,
      ContractDesign,
      UpholdPay,
      Docusign,
      CommercialsEditor,
      InvoiceTempateWizard,
      Hot,
      TransactionsEditor,
      InvoicesEditor,
      InvoiceCard,
      DocusignCard,
      SafePipe,
      UploadCard,
      DeviceKey,
      ForbiddenValidatorDirective,
      PositiveNumberValidatorDirective,
      SelectionRequiredDirective
   ],
   imports: [ // import Angular's modules
      BrowserModule,
      FormsModule,
      HttpModule,
      MaterialModule.forRoot(),
      RouterModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules, useHash: true}),
      DropdownModule,
      FileUploadModule,
      CommonModule,
      ContractsModule
   ],
   providers: [ // expose our Services and Providers into Angular's dependency injection
      ENV_PROVIDERS,
      APP_PROVIDERS,
      {
         provide: 'profileResolver',
         useClass: ProfileResolver
      },
      {
         provide: 'devicesResolver',
         useClass: DevicesResolver
      },
      {
         provide: 'signaturesResolver',
         useClass: SignaturesResolver
      },
      {
         provide: 'contractsResolver',
         useClass: ContractsResolver
      },
      {
         provide: 'contractResolver',
         useClass: ContractResolver
      },
      {provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true},
      {provide: NG_VALIDATORS, useExisting: PositiveNumberValidatorDirective, multi: true}
   ]
})
export class AppModule {

   constructor(public appRef: ApplicationRef,
               public appState: AppState,
               @Inject('config') private config: any,
               private devTools: DevToolsExtension,
               private ngRedux: NgRedux<IAppState>,
               private actions: AppActions) {

     switch (Environment.CLIENT_MODE) {
       case ClientModes.LOCAL:
         console.log('Running in local mode');
         break;
       case ClientModes.REMOTE:
         console.log('Running in remote mode');
         break;
       case ClientModes.SERVER:
         console.log('Running in server mode');
         break;
       default:
         console.log('Running in unknown mode');
     }

      const enh = (Environment.DEBUG && devTools.isEnabled()) ?
         [... enhancers, devTools.enhancer({
            deserializeState: reimmutify,
         })] :
         enhancers;

      ngRedux.configureStore(rootReducer, INITIAL_STATE, middleware, enhancers);
      actions.setAuthState(config.state);
   }

   public hmrOnInit(store: StoreType) {
      if (!store || !store.state) {
         return;
      }
      // set state
      this.appState._state = store.state;
      // set input values
      if ('restoreInputValues' in store) {
         let restoreInputValues = store.restoreInputValues;
         setTimeout(restoreInputValues);
      }

      this.appRef.tick();
      delete store.state;
      delete store.restoreInputValues;
   }

   public hmrOnDestroy(store: StoreType) {
      const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
      // save state
      const state = this.appState._state;
      store.state = state;
      // recreate root elements
      store.disposeOldHosts = createNewHosts(cmpLocation);
      // save input values
      store.restoreInputValues = createInputTransfer();
      // remove styles
      removeNgStyles();
   }

   public hmrAfterDestroy(store: StoreType) {
      // display new elements
      store.disposeOldHosts();
      delete store.disposeOldHosts;
   }

}
