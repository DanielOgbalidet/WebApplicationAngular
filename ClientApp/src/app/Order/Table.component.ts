import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IOrder } from './order';
import { IUser } from '../users/user';
import { OrderService } from './orders.service';

@Component({
  selector: 'app-order-table',
  templateUrl: './Table.component.html',
  styleUrls: ['./Table.component.css'],
})

export class OrderTableComponent implements OnInit {
  newOrder: IOrder = {} as IOrder;
  newUser: IUser = {} as IUser;


  constructor(private _router: Router,
    private _orderService: OrderService,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    /*
    this.newOrder.StartDate = '23-02-23';
    this.newOrder.StartDate = '24-02-23';
    this.newOrder.HouseId = 1;
    this.newOrder.TotalPrice = 500;

    this.newUser.FirstName = 'Hans';
    this.newUser.LastName = 'Hansen';
    this.newUser.Address = 'Testveien';
    this.newUser.Number = '989898';
    this.newUser.Email = 'test@test.com';

    this.newOrder.User = this.newUser;
    this.newOrder.User.Email = this.newUser.Email;
    console.log(this.newOrder.User.Email);
    /*
    this._orderService.createOrder(this.newOrder)
      .subscribe(response => {
        if (response.success) {
          console.log(response.message);
        }
        else {
          console.log("Order creation failed");
        }
      });
      */
  }
}

/* if (this.isEditMode) {
    this._houseService.updateHouse(this.houseId, newHouse)
      .subscribe(response => {
        if (response.success) {
          console.log(response.message);
          this._router.navigate(['/houses']);
        } else {
          console.log('House update failed');
        }
      });*/
/* String trip_start, String trip_end, int inHouseId, int inTotalPrice, String email */

/*
export interface IOrder {
OrderId: number;
OrderDate: string;
UserId: number;
User: IUser;
HouseId: number;
House: IHouse;
StartDate: string;
EndDate: string;
TotalPrice: number; 
} 
*/

