import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../users.service';

@Component({
  selector: 'app-register-component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  userForm: FormGroup;

  constructor(private _formbuilder: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _route: ActivatedRoute) {
    this.userForm = _formbuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      number: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    }

  ngOnInit(): void {
    console.log("register");
  }

  onSubmit() {
    const newUser = this.userForm.value;

    this._userService.createUser(newUser).subscribe(response => {
      if (response.success) {
        console.log(response.message);
        this._router.navigate(['/login']);
      } else {
        console.log('User creation failed');
      }
    });
  }
}
