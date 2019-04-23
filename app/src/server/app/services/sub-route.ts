let express = require('express');
let config = require('../config');
const authCtrl = require('../auth/auth.ctrl');

export class SubRoute {
   router: any;
   sdk: any;

   constructor(private app: any, private path: string) {
      this.router = express.Router();
      console.log('path: ' + path);
   }

   public create(routes, sdk) {
      this.sdk = sdk;

      Object.keys(routes).forEach(path => {
         let route = routes[path];
         Object.keys(route).forEach(operation => {
            let process = route[operation];
            this.createOperation(path, operation, process);
         });
      });

      this.app.use(this.path, this.router);
   }

   createOperation(path: string, operation: string, process: any) {
      path = '/' + path;

      let processHandler = (req, res) => {
         let response: any = {
            success: false
         };

         let sdk = null;
         if (operation !== 'noauth' && this.sdk) {
            sdk = this.sdk.create(req, error => {
               response.error = error;
               return res.status(200).send(JSON.stringify(response));
            });
         }

         process(req, res, sdk, (error, data) => {
            if (error) {
               response.error = error;
            } else {
               response.success = true;
            }

            response.data = data;
            return res.status(200).send(JSON.stringify(response));
         });
      };

      switch (operation) {
         case 'get':
            this.router.get(path, authCtrl.ensureAuthenticated, processHandler);
            break;
         case 'patch':
            this.router.patch(path, authCtrl.ensureAuthenticated, processHandler);
            break;
         case 'post':
            this.router.post(path, authCtrl.ensureAuthenticated, processHandler);
            break;
         case 'post-noauth':
            this.router.post(path, processHandler);
            break;
         case 'put':
            this.router.put(path, authCtrl.ensureAuthenticated, processHandler);
            break;
         case 'noauth':
            this.router.get(path, processHandler);
            break;
      }
   }
}

