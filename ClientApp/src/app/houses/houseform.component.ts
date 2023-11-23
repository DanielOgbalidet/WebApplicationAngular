import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from './houses.service';

@Component({
  selector: "app-houses-houseform",
  templateUrl: "./houseform.component.html",
  styleUrls: ['./houseform.component.css']
})

export class HouseformComponent {
  houseForm: FormGroup;
  isEditMode: boolean = false;
  houseId: number = -1;
  gridImg: File | null = null;

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
      userId: [0],
      gridImg: [null]
    });
  }

  onFileSelected(event: any): void {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const imgUrl = fileInput.files[0].name;
      this.houseForm.patchValue({ imageUrl: imgUrl });
      this.houseForm.patchValue({ gridImg: fileInput.files[0] });
    }
  }


  onSubmit() {
    console.log("HouseCreate form submitted");
    console.log(this.houseForm);
    const newHouse = this.houseForm.value;

    const gridImgControl = this.houseForm.get('gridImg');
    const addressControl = this.houseForm.get('address');

    if ((gridImgControl && gridImgControl.value) && (addressControl && addressControl.value)) {
      const gridImg = gridImgControl.value;
      const address = addressControl.value;

      this._houseService.createDirGridImg(gridImg, address).subscribe(dirResponse => {
        if (dirResponse.success) {
          console.log(dirResponse.message);
          this._router.navigate(['/houses']);
        } else {
          console.log('Could not create directory');
        }
      });
    } else {
      console.log("No image inserted");
    }

    if (this.isEditMode) {
      this._houseService.updateHouse(this.houseId, newHouse)
        .subscribe(response => {
          if (response.success) {
            console.log(response.message);
            this._router.navigate(['/houses']);
          } else {
            console.log('House update failed');
          }
        });
    } else {
      this._houseService.createHouse(newHouse).subscribe(response => {
        if (response.success) {
          console.log(response.message);
          this._router.navigate(['/houses']);
        } else {
          console.log('House creation failed');
        }
      });
    }
  }


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
            userId: house.user.UserId
          });
        },
        (error: any) => {
          console.error('Error loading house for edit: ', error);
        }
      );
  }

}
