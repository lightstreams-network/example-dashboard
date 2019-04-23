import {Injectable} from "@angular/core";
import {ActionsDispatcher} from "../actions-dispatcher";
import {AppActions} from "./app";
import {LocalService} from "../../services/local-service";
import {ConsensusService} from "../../services/consensus-service";
import {Environment} from "../../environment";

@Injectable()
export class BlockchainActions {
    static LOCAL_CONFIG = 'BLOCKCHAIN_CONFIG';
    static LOAD_CONFIG_FAILED = 'BLOCKCHAIN_LOAD_CONFIG_FAILED ';
    static LOCAL_STATUS_UPDATE = 'BLOCKCHAIN_LOCAL_STATUS_UPDATE';
    static VALIDATOR_STATUS_UPDATE = 'BLOCKCHAIN_REMOTE_STATUS_UPDATE';

    constructor(private actions: ActionsDispatcher,
                private consensus: ConsensusService,
                private local: LocalService,) {
    }


    getEthereumConfig(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.local.getEthereumConfig()
                .then(config => {
                    this.actions.dispatch(BlockchainActions.LOCAL_CONFIG, config);
                    resolve(config);
                })
                .catch(err => {
                    this.actions.dispatch(AppActions.SYSTEM_ERROR);
                    this.handleError(err);
                    resolve();
                });
        })
    }

    getLocalStatus()  {
        return this.consensus.getStatus(Environment.LOCAL_SERVER)
            .then(data => this.actions.dispatch(BlockchainActions.LOCAL_STATUS_UPDATE, data.result))
            .catch(err => this.handleError(err))
    }

    getValidatorStatus(address: string)  {
        this.consensus.getStatus(address)
            .then(data => this.actions.dispatch(BlockchainActions.VALIDATOR_STATUS_UPDATE, data))
            .catch(err => this.handleError(err))
    }

   getContents(): Promise<any> {
      return new Promise<any>((resolve, reject) => {
         this.local.getContents()
            .then(contents => {
               if (!contents) {
                   return [];
               }
               resolve(contents);
            })
            .catch(err => {
               this.handleError(err);
               resolve();
            });
      })
   }


    handleError(err) {
        console.log(err);
    }
}
