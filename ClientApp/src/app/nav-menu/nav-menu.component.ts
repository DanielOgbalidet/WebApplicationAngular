import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  isLoggedIn: boolean = false;

  constructor(private _router: Router, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(paramMap => {
      if (sessionStorage.getItem("email") === null) {
        this.isLoggedIn = false; // User is not logged in
      } else {
        this.isLoggedIn = true; // User is logged in
      }
    });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  toggleLoginStatus() {
    if (this.isLoggedIn) {
      //If they are logged in
      console.log('Logging out...');
      //Logging out clears session
      sessionStorage.clear();
      this.isLoggedIn = false;
    }
  }
}
