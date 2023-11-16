import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HouseService } from './houses.service';

@Component({
  selector: "app-houses-houseform",
  templateUrl: "./houseform.component.html"
})

export class HouseformComponent {
  houseForm: FormGroup;

  constructor(private _formbuilder: FormBuilder, private _router: Router, private _houseService: HouseService) {
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
    const newHouse = this.houseForm.value;
    const createUrl = "api/house/create";
    this._houseService.createHouse(newHouse).subscribe(response => {
      if (response.success) {
        console.log(response.message);
        this._router.navigate(['/houses']);
      }
      else {
        console.log('House creation failed');
      }
    });
  }

  backToHouses() {
    this._router.navigate(['/houses']);
  }
}
