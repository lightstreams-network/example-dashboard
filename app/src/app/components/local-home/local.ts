import {Component} from '@angular/core';
import {INITIAL_STATE, IProfile, IProfileRecord} from "../../store/state/profile";
import {select} from "ng2-redux";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {Environment} from "../../environment";
import {SessionState} from "../../store/state/session";
import {BlockchainActions} from "../../store/actions/blockchain";
import {IBlockchain, IBlockchainRecord} from "../../store/state/blockchain";

import Chart from 'chart.js'
import {IDevice} from "../../store/state/device";
import {DeviceActions} from "../../store/actions/device";
import {ContractActions} from "../../store/actions/contract";

@Component({
   selector: 'local',
   template: require('./local.html'),
   styles: [require('./local.scss')],
})
export class LocalHomeComponent {
   @select() profile$: Observable<IProfileRecord>;
   @select() blockchain$: Observable<IBlockchainRecord>;
   @select() device$: Observable<IDevice>;

   profileSubscription: Subscription;
   blockchainSubscription: Subscription;
   deviceSubscription: Subscription;

   device: IDevice;
   profile: IProfile;

   registerLink: string;

   deviceRegistered: boolean;

   blockchainConfigResolved: boolean;
   blockchainStatus: IBlockchain;

   statusTick: any;
   balanceTick: any;

   network: string;
   consensusVer: string;
   localHeight: number = 0;
   blockchainHeight: number = 0;
   blocksRemaining: number = 0;
   percentSynced: number = 0;
   isSynced: boolean;
   status: string;

   chart: any;
   chartData: any;
   chartOptions: any;
   chartColours: any = [
      "#3f4f62",
      "#ffffff"
   ];

   chartColoursSynced: any = [
      "#4caf50",
      "#ffffff"
   ];

   balance: string = "";

   contents = [];
   searching: boolean;

   constructor(private session: SessionState,
               private actions: BlockchainActions,
               private contractActions: ContractActions,
               private deviceActions: DeviceActions,
               private router: Router) {

      this.profile = INITIAL_STATE;

      this.chartOptions = {
         title: {
            display: false,
            fontSize: 14,
            text: 'Blocks synchronisation'
         },
         legend: {
            display: false,
            position: 'bottom',
         },
         animation: {
            duration: 0
         },
         cutoutPercentage: 75
      };

      this.chartData = {
         labels: [
            "Sync'ed"
         ],
         datasets: [{
            data: [0, 1],
            backgroundColor: this.chartColours,
         }]
      };
   }

   ngOnInit() {
      if (this.session.profileLoaded) {
         this.deviceRegistered = true;
      }

      this.deviceSubscription = this.device$.subscribe((d: any) => {
         this.device = d.toJS();

         let location = window.location;
         let callbackUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
         let publicKey = this.device.defaultSignature.publicKey;
         this.registerLink = `${Environment.PUBLIC_WEB_SERVER}/?device=${this.device.deviceId}&account=${publicKey}&callback=${callbackUrl}`;

      });

      this.profileSubscription = this.profile$.subscribe(p => {
         this.profile = p.toJS();
      });

      this.blockchainSubscription = this.blockchain$.subscribe(b => {
         this.updateblockchainStatus(b)
      });

      this.getBalance();
      this.getContents();
      this.getBlockChainState();

      if (this.device.lightClient) {
         console.log("Light client");
         this.status = "Light Client";
         return;
      } else {
         // this.chart = new Chart("blocks-remaining", {
         //    type: 'doughnut',
         //    data: this.chartData,
         //    options: this.chartOptions
         // });
      }
   }

   getContents() {
      this.actions.getContents()
         .then(c => {
            if (c) {
               this.contents = c;
            }
         });
   }

   private getBalance() {
      let account = this.device.defaultSignature.account;
      this.deviceActions.getBalance(account);
      this.balanceTick = setInterval(() => {
         this.deviceActions
            .getBalance(account)
            .catch(() => {
               clearInterval(this.balanceTick);
            });

      }, 5000);
   }

   private getBlockChainState() {
      this.statusTick = setInterval(() => {
         this.actions.getLocalStatus().then(() => {
            this.refreshChart();
         });
      }, 5000);
   }

   updateblockchainStatus(b: IBlockchain) {
      this.blockchainStatus = b;

      // this.network = b.validatorInfo.network;
      // this.consensusVer = b.validatorInfo.consensusVersion;

      this.network = b.nodeInfo.network;
      this.consensusVer = b.nodeInfo.consensusVersion;

      this.isSynced = !b.syncing;

      if (!this.device.lightClient) {
         if (this.isSynced) {
            this.status = "Synchronised";
         } else {
            this.status = "Importing blocks";
         }
      }

      let validator = this.getValidator(b);

      if (this.blockchainConfigResolved || !validator) {
         // return;
      } else {
         this.blockchainConfigResolved = true;
         this.actions.getValidatorStatus(validator);
      }

      if (this.device.lightClient) {
         return;
      }
   }

   getValidator(b: any): string {
      let status = b.toJS();
      return status.validators && status.validators.length > 0 && status.validators[0] || null;
   }

   ngOnDestroy() {
      if (this.profileSubscription) {
         this.profileSubscription.unsubscribe();
      }

      this.blockchainSubscription.unsubscribe();
      this.deviceSubscription.unsubscribe();

      if (this.statusTick) {
         clearInterval(this.statusTick);
      }

      if (this.balanceTick) {
         clearInterval(this.balanceTick);
      }
   }

   onRegister() {
      window.location.href = Environment.PUBLIC_WEB_SERVER;
   }

   refreshChart() {
      let bc = this.blockchainStatus;
      this.localHeight = bc.nodeInfo.blockchainHeight;
      this.blockchainHeight = bc.validatorInfo.blockchainHeight;

      if (this.localHeight > this.blockchainHeight) {
         this.blockchainHeight = this.localHeight;
      }
      if (this.blockchainHeight != 0) {
         this.percentSynced = Math.floor(this.localHeight / this.blockchainHeight * 100);
      } else {
         this.percentSynced = 0;
      }

      this.blocksRemaining = this.blockchainHeight - this.localHeight;
      console.log("blocksRemaining: ", this.blocksRemaining);
      if (this.blocksRemaining <= 0) {
         this.blocksRemaining = 0;
      }

      if (!this.chart) {
         return;
      }

      if (this.isSynced) {
         this.chart.data.datasets[0].backgroundColor = this.chartColoursSynced;
      }

      this.chart.data.datasets[0].data = [this.localHeight, this.blocksRemaining];
      this.chart.update();
   }

   publish() {
      this.router.navigate(["publish-content"]);
   }

   getContent(metaAddr: string) {
      this.searching = true;
      let signature = this.device.defaultSignature;
      this.contractActions.getContractFromClient(signature, metaAddr)
         .then(contract => {
            this.searching = false;

            if (!contract) {
               return;
            }

            this.router.navigate(['contracts', metaAddr]);
         })

   }
}
