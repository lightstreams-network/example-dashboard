import { Injectable } from '@angular/core';
import {AppServer} from "./server/app-server";
import {IContract, IPermission} from "../store/state/contract";

@Injectable()
export class ContractService {

   constructor(private server: AppServer) {}

   newContract(contract: IContract): Promise<any> {
      return this.server.post('/contract/new', contract);
   }

   newContent(contract: IContract): Promise<any> {
      return this.server.post('/contract/new-content', contract);
   }

   getContract(metaAddr: string): Promise<any> {
      return this.server.get(`/contract/${metaAddr}`);
   }

   grantPermission(metaAddr: string, permission: IPermission): Promise<any> {
      return this.server.post(`/contract/permissions/${metaAddr}`, permission);
   }
}
