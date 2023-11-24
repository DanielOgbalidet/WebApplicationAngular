import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IOrder } from './order';
import { OrderService } from './orders.service';

@Component({
  selector: 'app-order-table',
  templateUrl: './Table.component.html',
  styleUrls: ['./Table.component.css'],
})
export class OrderTableComponent implements OnInit {
  newOrder: IOrder = {} as IOrder;
 
  constructor(private _router: Router,
    private _orderService: OrderService,
    private _route: ActivatedRoute) {}

  ngOnInit(): void {
    
  }

 
}
