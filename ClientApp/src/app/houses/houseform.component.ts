import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from './houses.service';

@Component({
  selector: "app-houses-houseform",
  templateUrl: "./houseform.component.html"
})

export class HouseformComponent {
  houseForm: FormGroup;
  isEditMode: boolean = false;
  houseId: number = -1;

  constructor(private _formbuilder: FormBuilder,
    private _router: Router,
    private _houseService: HouseService,
    private _route: ActivatedRoute) {
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
    if (this.isEditMode) {
      this._houseService.updateHouse(this.houseId, newHouse)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(['/houses']);
          }
          else {
            console.log('House update failed');
          }
        });
    }
    else {
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
  }
  //const createUrl = "api/house/create";


  backToHouses() {
    this._router.navigate(['/houses']);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      if (params['mode'] === 'create') {
        this.isEditMode = false;
      } else if (params['mode'] === 'edit') {
        this.isEditMode = true;
        this.houseId = +params['id'];
        this.loadHouseForEdit(this.houseId);
      }
    });
  }

  loadHouseForEdit(houseId: number) {
    this._houseService.getHouseById(houseId)
      .subscribe(
        (house: any) => {
          console.log('retreived house: ', house);
          this.houseForm.patchValue({
            price: house.Price,
            address: house.Address,
            imageUrl: house.ImageUrl,
            bedrooms: house.Bedrooms,
            guests: house.Guests,
            description: house.Description,
            userId: house.UserId
          });
        },
        (error: any) => {
          console.error('Error loading house for edit: ', error);
        }
      );
  }

}
