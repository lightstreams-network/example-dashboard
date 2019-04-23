import {NgModule, Injectable}             from '@angular/core';
import {RouterModule, Routes, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Contracts} from "./contracts/contracts";
import {ContractDetail} from "./contract-detail/contract-detail";
import {MaterialModule} from "@angular/material";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "../common/common.module";
import {ContractPermissions} from "./contract-permissions/contract-permissions";
import {ContractsResolver, ContractResolver} from "../app.routes";
import {ContractSearch} from "./search/contract-search";
import {ContractTransfer} from "./contract-transfer/contract-transfer";

const routes: Routes = [
   {
      path: 'contracts',
      component: Contracts,
      resolve: {
         contracts: 'contractsResolver',
      },
   },
   {
      path: 'search',
      component: ContractSearch
   },
   {
      path: 'contracts/:id',
      component: ContractDetail,
      resolve: {
         contract: 'contractResolver',
         profile: 'profileResolver'
      },
   },
   {
      path: 'contracts/:id/permissions',
      component: ContractPermissions,
      resolve: {
         contract: 'contractResolver'
      },
   },
   {
      path: 'contracts/:id/transfer',
      component: ContractTransfer,
      resolve: {
         contract: 'contractResolver'
      },
   }
];

@NgModule({
   declarations: [
      Contracts,
      ContractDetail,
      ContractPermissions,
      ContractSearch,
      ContractTransfer
   ],
   providers: [ // expose our Services and Providers into Angular's dependency injection
      {
         provide: 'contractsResolver',
         useClass: ContractsResolver
      },
      {
         provide: 'contractResolver',
         useClass: ContractResolver
      }
   ],
   imports: [
      RouterModule.forChild(routes),
      BrowserModule,
      FormsModule,
      HttpModule,
      MaterialModule.forRoot(),
      CommonModule
   ],
   exports: [
      RouterModule
   ]
})
export class ContractsModule { }

