import { Component, OnInit } from '@angular/core';
import { IHouse } from '../house';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../houses.service';

@Component({
  selector: 'app-listings-component',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})

export class ListingsComponent implements OnInit {
  myListings: IHouse[] = [];
  userId: number = -1;
  baseImgUrl: string;

  constructor(private _router: Router,
    private _houseService: HouseService,
    private _route: ActivatedRoute) {
    this.baseImgUrl = "/assets/images/";
  }

  ngOnInit(): void {
    console.log("Here");
    this._route.params.subscribe(params => {
      this.userId = + params['id'];
      console.log("UserId", this.userId);
      this.getMyListings(this.userId);
      console.log("Get listings done");
    });
  }

  deleteHouse(house: IHouse): void {
    const confirmDelete = confirm(`Are you sure you want to delete "${house.Address}"`);
    if (confirmDelete) {
      this._houseService.deleteHouse(house.HouseId).subscribe(
        (response) => {
          if (response.success) {
            console.log("House deleted", response.message);
            window.location.reload();
          }
        },
        (error) => {
          console.error('Error deleting house:', error);
        });
    }
  }

  getMyListings(userId: number) {
    console.log("Get listings started");
    this._houseService.getListings(this.userId)
      .subscribe(
        (listings: IHouse[]) => {
          console.log('retreived listings: ', JSON.stringify(listings));
          this.myListings = listings;
        },
        (error: any) => {
          console.error('Error loading listings for edit: ', error);
        }
      );
  }
}
