import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from './app-state';
import { ServerActions } from './actions/server';

@Injectable()
export class ActionsDispatcher {

   constructor(private ngRedux: NgRedux<IAppState>) {
   }

   dispatch(action: string, payload?: any) {
      return this.ngRedux.dispatch({
         type: action,
         payload
      });
   }

   getState(): IAppState {
      return this.ngRedux.getState();
   }

   dispatchAsync(action: string, command: any, next?: any) {
      command().then((result) => {
         this.ngRedux.dispatch({
            type: action,
            payload: result
         });

         if (next) {
            next(null, result);
         }
      }).catch(error => {
         this.ngRedux.dispatch({
            type: ServerActions.ASYNC_ERROR,
            payload: {action: action, payload: error}
         });

         if (next) {
            next(error, null);
         }
      });
   }
}
