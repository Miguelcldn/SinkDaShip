import { Component } from '@angular/core';

import { AppState } from '../app.service';

@Component({
  selector: 'home',
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})

export class HomeComponent {
  name = '';
  hide = true;

  constructor(public appState: AppState) {

  }

  playGame() {
    if(this.name) {
      this.hide = false;
    } else {
      alert('Please inform your name!');
    }
  }
}
