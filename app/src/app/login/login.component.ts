import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'home',
  styleUrls: [ './login.component.scss' ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  logging_in = false;
  valid = true;
}
