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
  myOrders: IOrder[] = [];
  newOrder: IOrder = {} as IOrder;
  newUser: IUser = {} as IUser;


  constructor(private _router: Router,
    private _orderService: OrderService,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMyOrders();
  }

  getMyOrders() {
    const email = sessionStorage.getItem("email")!;
    this._orderService.getOrders(email)
      .subscribe(
        (orders: IOrder[]) => {
          console.log('Orders retrieved successfully:', orders);
          this.myOrders = orders;
        },
        (error: any) => {
          console.error('Error loading orders: ', error);
        }
      );
  }

  deleteOrder(order: IOrder): void {
    const confirmDelete = confirm(`Are you sure you want to delete order for "${order.House.Address}"`);
    if (confirmDelete) {
      this._orderService.deleteOrder(order.OrderId).subscribe(
        (response) => {
          if (response.success) {
            console.log("Order deleted", response.message);
            window.location.reload();
          }
        },
        (error) => {
          console.error('Error deleting order:', error);
        });
    }
  }
}

