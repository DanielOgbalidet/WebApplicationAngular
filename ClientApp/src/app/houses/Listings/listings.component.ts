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
    this.getMyListings();
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

  getMyListings() {
    console.log("Get listings started");
    const email = sessionStorage.getItem("email")!;
    this._houseService.getListings(email)
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
