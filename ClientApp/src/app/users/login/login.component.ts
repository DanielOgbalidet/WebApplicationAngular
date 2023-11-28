import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../users.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  email!: string;
  password!: string;
  public loginFail = false;
  loaderCheck: boolean = false;

  constructor(private _router: Router,
    private _userService: UserService) { }

  onSubmit() {
    //Check if email and password exsist in our table
    console.log("Log in clicked"); 
    this._userService.checkLogin(this.email, this.password).subscribe((loggedIn) => {
      if (!loggedIn) {
        //Show error message if user can't log in
        this.loginFail = true;
        this.loaderCheck = false;
      } else {
        //If user log in, a new session is created
        this.loaderCheck = true;
        this.loader();
        this.loginFail = false;
        sessionStorage.setItem("email", this.email);
        this._router.navigate(['/nav-menu']).then(() => {
          window.location.reload()
        });
      }
    });
  }

  loader(): void {
     this.loaderCheck = true;
  }

  ngOnInit(): void {}
}
