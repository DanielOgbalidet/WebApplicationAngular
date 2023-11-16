import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: "app-houses-houseform",
  templateUrl: ".houseform.component.html"
})

export class HouseformComponent {
  houseForm: FormGroup;

  constructor(private _formbuilder: FormBuilder) {
    this.houseForm = _formbuilder.group({
      address: ['', Validators.required],
      price: [0, Validators.required],
      imageUrl: [''],
      bedrooms: [0],
      guests: [0],
      description: [''],
      userId: [0]
    });
  }

  onSubmit() {
    console.log("HouseCreate form submitted");
    console.log(this.houseForm);
    console.log('The house ' + this.houseForm.value.address + ' is created');
    console.log(this.houseForm.touched);
  }

}
