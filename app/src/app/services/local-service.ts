import { Injectable } from '@angular/core';
import {LocalServer} from "./server/local-server";
import {IContract, IPermission} from "../store/state/contract";
import {ISignature} from "../store/state/signature";

export interface NewContract {
   state: any;
   contract: any;
}

@Injectable()
export class LocalService {

   constructor(private server: LocalServer) {
   }

   getMachineConfig(): Promise<any>  {
      return this.server.get('/machine/config');
   }

   generateToken(contract: string): Promise<any>  {
      return this.server.get(`/token/new/${contract}`);
   }

   getStatus(): Promise<any> {
      return this.server.get('/status');
   }

   getEthereumConfig(): Promise<any> {
      return this.server.get('/ethereum/config');
   }

   search(signature: ISignature, message): Promise<any> {
      return this.server.post('/search', {signature, message});
   }

   getContracts(): Promise<any> {
      return this.server.get('/contracts');
   }

   getIpfsData(ipfsAddr: string, format: string): Promise<any> {
      let formatParam;
      if (format) {
         formatParam = '?format=' + format;
      }
      return this.server.get(`/ipfs/${ipfsAddr}/${formatParam}`);
   }

   getIpfsDataWithToken(token: string, metaAddr: string, ipfsAddr: string): Promise<any> {
      return this.server.getBlob(`/ipfs/${ipfsAddr}?contract=${metaAddr}`, token);
   }

   getContractData(ipfsAddr: string, metaAddr: string, format: string): Promise<any> {
      let formatParam;
      if (format) {
         formatParam = '&format=' + format;
      }
      return this.server.get(`/contracts/content/${ipfsAddr}/?contract=${metaAddr}${formatParam}`);
   }

    getContract(signature: ISignature, metaAddr: string): Promise<any> {
      return this.server.post(`/contracts/contract/${metaAddr}`, {signature, message: {}});
   }

   getToken(contract: string, signature: ISignature): Promise<any> {
      return this.server.post(`/token/${contract}`, {signature, message: {}});
   }

   unlock(metaAddr: string, signatureId: string): Promise<any> {
      return this.server.post('/unlock', {metaAddr, signatureId});
   }

   sendValue(to: string, value: string): Promise<any> {
      return this.server.post('/account/send', {to, value});
   }

   deployContract(contract: IContract, receiptHash): Promise<any> {
      return this.server.post(`/contracts/deploy/${receiptHash}`, contract);
   }

   newContract(contract: IContract): Promise<any> {
      return this.server.post('/contracts/new', contract);
   }

   initializeState(signature: ISignature, message: IContract): Promise<any> {
      return this.server.post('/contracts/init', {signature, message});
   }

   setPrice(signature: ISignature, metaAddr: string, price: string): Promise<any> {
      return this.server.post(`/contracts/price/${metaAddr}`, {signature, message: {price}});
   }

   getPrice(metaAddr: string): Promise<any> {
      return this.server.get(`/contracts/price/${metaAddr}`);
   }

   signContract(contract: IContract): Promise<any> {
      return this.server.post('/contracts/sign', {contract});
   }

   grantPermission(metaAddr: string, permission: IPermission, clientIPs: string[]): Promise<any> {
      return this.server.post(`/contracts/permissions/${metaAddr}`, {permission, clientIPs});
   }

   purchaseContent(signature: ISignature, metaAddr: string, price: string): Promise<any> {
      return this.server.post(`/contracts/purchase/${metaAddr}`, {signature, message: {price}});
   }

   transferOwnership(metaAddr: string, signature: ISignature): Promise<any> {
      return this.server.post('/contracts/transferOwnership', {metaAddr, newOwner: signature});
   }

   newSignature(data: any): Promise<any> {
      return this.server.post('/keys/new', data);
   }

   updateSignature(data: any): Promise<any> {
      return this.server.post('/keys/signatureId', data);
   }

   getSignatures(): Promise<any> {
      return this.server.get('/keys');
   }

   getBalance(account) {
      return this.server.get(`/account/balance/${account}`);
   }

   getContents() {
      return this.server.get(`/contents`);
   }

   /*
   getData(metaAddr: string, contentAddr: string, reader: FileReader) {
      this.server.getData(`/contracts/content/${metaAddr}`, contentAddr, reader)
   }
   */
}
