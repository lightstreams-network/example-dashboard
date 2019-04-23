import {Component, ViewChild} from '@angular/core';
import {FileUpload} from 'primeng/components/fileupload/fileupload';
import {SessionState} from '../../store/state/session';

@Component({
   selector: 'upload-card',
   template: require('./upload-card.html'),
   styles: [require('./upload-card.scss')],
})
export class UploadCard {
   @ViewChild('uploader')
   uploader: FileUpload;

   constructor(private sessionState: SessionState) {
   }

   ngOnInit() {
      let token = '';
      let session = this.sessionState.session;
      if (session.token) {
         token = session.token;
      }

      this.uploader.onBeforeUpload.subscribe((event: any) => {
         event.xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      });
   }
}
