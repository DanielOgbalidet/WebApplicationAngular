import { Component, OnInit } from '@angular/core';
import { IHouse } from '../house';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../houses.service';
import { IUser } from '../user';

@Component({
  selector: 'app-details', // Specify the selector for the component
  templateUrl: './details.component.html', // Path to the HTML template
  styleUrls: ['./details.component.css'] // Array of CSS stylesheets
})

export class DetailsComponent implements OnInit {
  newHouse: IHouse = {} as IHouse; // Adjust the type according to your house object structure
  newUser: IUser = {} as IUser; 
  houseId: number = -1;

  constructor(private _router: Router,
    private _houseService: HouseService,
    private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.houseId =+ params['id'];
      this.getHouse(this.houseId);
    });
  }

  getHouse(houseId: number) {
    this._houseService.getHouseById(houseId)
      .subscribe(
        (house: any) => {
          console.log('retreived house: ', house);
          console.log('retreived user: ', house.user); 
          this.newHouse = house;
          this.newHouse.User = house.user; 
          console.log("New House: ", this.newHouse);
        },
        (error: any) => {
          console.error('Error loading house for edit: ', error);
        }
      );
  }

  /*ngOnInit(): void {
    this._route.params.subscribe(params => {
      if (params['mode'] === 'create') {
        this.isEditMode = false;
      } else if (params['mode'] === 'edit') {
        this.isEditMode = true;
        this.houseId = +params['id'];
        this.loadHouseForEdit(this.houseId);
      }
    });
  } */

  
}


