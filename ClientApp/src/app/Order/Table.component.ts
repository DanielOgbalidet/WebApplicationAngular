
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-order-table',
  templateUrl: './Table.component.html',
  styleUrls: ['./Table.component.css'],
})
export class OrderTableComponent implements OnInit {
 
  constructor(private _router: Router) {}

  ngOnInit(): void {
    console.log('Orders')
  }

 
}
