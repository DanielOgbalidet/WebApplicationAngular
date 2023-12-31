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
  moreImg: File[] | null = null;

  constructor(private _formbuilder: FormBuilder,
    private _router: Router,
    private _houseService: HouseService,
    private _route: ActivatedRoute) {
    this.houseForm = _formbuilder.group({
      address: ['', Validators.required],
      price: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      imageUrl: [''],
      bedrooms: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      guests: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      description: [''],
      userId: [0],
      gridImg: [null],
      moreImg: [[null]]
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

  onMoreImgSelected(event: any): void {
    const moreImgs = event.target;
    if (moreImgs.files.length > 0) {
      this.houseForm.patchValue({ moreImg: moreImgs.files });
    }
  }

  onSubmit() {
    const newHouse = this.houseForm.value;

    const gridImgControl = this.houseForm.get('gridImg');
    const addressControl = this.houseForm.get('address');
    const moreImgControl = this.houseForm.get('moreImg');

    if (addressControl && addressControl.value) {
      const address = addressControl.value;

      if ((gridImgControl && gridImgControl.value)) {
        const gridImg = gridImgControl.value;

        this._houseService.createDirGridImg(gridImg, address).subscribe(dirResponse => {
          if (dirResponse.success) {
            console.log(dirResponse.message);
          } else {
            console.error('Could not create directory');
          }
        });
      }

      if (moreImgControl && moreImgControl.value) {
        const images = moreImgControl.value;
        this._houseService.uploadImages(images, address).subscribe(imgResponse => {
          if (imgResponse.success) {
            console.log(imgResponse.message);
          } else {
            console.error("Images failed to upload");
          }
        });
      }
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

    this._houseService.showId(sessionStorage.getItem("email")!).subscribe(
      (userIdValue: number) => {
        // Update the userId in the form
        this.houseForm.get('userId')!.setValue(userIdValue);
      },
      (error) => {
        console.error("Error fetching userId:", error);
      }
    );
  }

  loadHouseForEdit(houseId: number) {
    this._houseService.getHouseById(houseId)
      .subscribe(
        (house: any) => {
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
