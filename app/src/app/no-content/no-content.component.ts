import { Component } from '@angular/core';
import {ActivatedRouteSnapshot, Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'no-content',
  template: `
    <div>
      <h1>404: page missing</h1>
    </div>
  `
})
export class NoContentComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    let url = this.route.snapshot.url;
    if (url.length === 0) {
      return;
    }

    let path = url[0];

    this.router.navigate(['contracts/' + path]);
  }
}
