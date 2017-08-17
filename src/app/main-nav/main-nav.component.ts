import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html'
})
export class MainNavComponent implements OnInit {

  navHidden: boolean;

  constructor() { }

  ngOnInit() {
    this.navHidden = true;
  }

}
