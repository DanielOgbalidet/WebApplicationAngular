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

  constructor(private _router: Router,
    private _houseService: HouseService,
    private _route: ActivatedRoute) {
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
