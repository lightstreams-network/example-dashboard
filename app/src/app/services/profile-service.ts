import { Injectable } from '@angular/core';
import {AppServer} from "./server/app-server";

@Injectable()
export class ProfileService {

   constructor(private service: AppServer) {}

   public getProfile() {
      return this.service.get('/profile/me');
   }

    public getBalance(account) {
        return this.service.get(`/profile/account/${account}`);
    }

   public getSignature(signatureId) {
      return this.service.get(`/profile/signatures/${signatureId}`);
   }

   public addSignature(signature) {
      return this.service.post('/profile/signatures', signature);
   }

   public getDevices() {
      return this.service.get('/profile/devices');
   }

   public addDevice(device) {
      return this.service.post('/profile/devices', {device: device});
   }

   public save(profile) {
      return this.service.patch('/profile', 'me', {profile: profile});
   }
}
