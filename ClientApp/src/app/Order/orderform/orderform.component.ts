import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../orders.service';

@Component({
  selector: "app-orders-houseform",
  templateUrl: "./orderform.component.html",
  styleUrls: ['./orderform.component.css']
})

export class OrderformComponent {
  @ViewChild('startDate') startDate!: ElementRef;
  @ViewChild('endDate') endDate!: ElementRef;

  orderForm: FormGroup;
  orderId: number = -1;
  pricePerNight: number = 0;
  differenceInDays: number = 0;
  dateInvalid: boolean = false;

  constructor(private _formbuilder: FormBuilder,
    private _router: Router,
    private _orderService: OrderService,
    private _route: ActivatedRoute) {
    this.orderForm = _formbuilder.group({
      orderDate: [null],
      userId: [null],
      houseId: [null],
      startDate: [null],
      endDate: [null],
      totalPrice: [null]
    });
  }

  onSubmit() {
    this.findDifferenceInDays();

    const newPrice = this.pricePerNight * this.differenceInDays;
    this.orderForm.patchValue({
      totalPrice: newPrice,
    });

    const newOrder = this.orderForm.value;

    this._orderService.updateOrder(this.orderId, newOrder)
      .subscribe(response => {
        if (response.success) {
          console.log(response.message);
          this._router.navigate(['/Table']);
        } else {
          console.log('Order update failed');
        }
      });
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.orderId = +params['orderId'];
      this.loadOrderForUpdate(this.orderId);
    })
  }


  loadOrderForUpdate(orderId: number) {
    this._orderService.getOrderById(orderId)
      .subscribe(
        (order: any) => {
          this.orderForm.patchValue({
            orderDate: order.OrderDate,
            userId: order.UserId,
            houseId: order.HouseId,
            startDate: order.StartDate,
            endDate: order.EndDate,
            totalPrice: order.TotalPrice
          });
          this.findPricePerNight();
        },
        (error: any) => {
          console.error('Error loading order', error);
        }
    )
  }

  findPricePerNight() {
    const total = this.orderForm.get("totalPrice")?.value;
    this.findDifferenceInDays();

    this.pricePerNight = total / this.differenceInDays;
  }

  findDifferenceInDays() {
    const startDateValue = this.orderForm.get('startDate')?.value;
    const endDateValue = this.orderForm.get('endDate')?.value;

    // Turn it into date objects so we can calculate the difference in days
    const newstartDate = new Date(startDateValue);
    const newendDate = new Date(endDateValue);

    // Calculate the difference in milliseconds
    const differenceInMs = newendDate.getTime() - newstartDate.getTime();

    // Convert milliseconds to days
    this.differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
  }

  checkDates() {
    this.findDifferenceInDays();
    if (this.differenceInDays < 1) {
      this.dateInvalid = true;
    } else {
      this.dateInvalid = false;
    }
  }
}
