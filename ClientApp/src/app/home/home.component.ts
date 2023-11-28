import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private _router: Router,
    private _route: ActivatedRoute) { }

  orders() {
    if (sessionStorage.getItem("email") === null) {
      this._router.navigate(['/login'])
    } else {
      this._router.navigate(['/Table'])
    }
  }
}
