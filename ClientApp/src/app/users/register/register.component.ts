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
      number: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
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
        sessionStorage.setItem("email", newUser.email);
        this._router.navigate(['/home']);
      } else {
        console.log('User creation failed');
      }
    });
  }
}
