import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {select} from 'ng2-redux';
import {TypedRecord, makeTypedFactory} from 'typed-immutable-record';
import { IDevice } from './device';

export interface ISession {
   processing: boolean;
   state: string;
   token: string;
   localToken: string;
}

export interface ISessionRecord extends TypedRecord<ISessionRecord>,
    ISession {
}

export const sessionState = {
   NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
   TOKEN_EXPIRED: 'INCORRECT_CREDENTIALS',
   SERVICE_ERROR: 'SERVICE_ERROR',
   AUTHENTICATED: 'AUTHENTICATED',
   DEVICE_NOT_REGISTERED: 'DEVICE_NOT_REGISTERED'
};

export const INITIAL_STATE = {
   processing: false,
   state: sessionState.NOT_AUTHENTICATED,
   token: '',
   localToken: ''
};

export const SessionFactory = makeTypedFactory<ISession, ISessionRecord>(INITIAL_STATE);

@Injectable()
export class SessionState {

   @select(['session']) sessionState$: Observable<any>;
   @select(['device']) deviceState$: Observable<any>;

   public session: ISession;
   public device: IDevice;
   public profileLoaded: boolean;

   constructor() {
      this.sessionState$.subscribe(session => this.onSessionChange(session.toJS()));
      this.deviceState$.subscribe(device => this.onDeviceChange(device.toJS()));
   }

   authenticated(): boolean {
      return this.session.state === sessionState.AUTHENTICATED;
   }

   onSessionChange(session: ISession) {
      this.session = session;
   }

   onDeviceChange(device: IDevice) {
      this.device = device;
   }
}
