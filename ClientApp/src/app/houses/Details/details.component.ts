import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('startDateInput') startDateInput!: ElementRef;
  @ViewChild('endDateInput') endDateInput!: ElementRef;
  startDateMin: string = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
  endDateMin: Date = new Date(this.startDateMin);
  endDateMinString: string = '';
  newHouse: IHouse = {} as IHouse; // Adjust the type according to your house object structure
  newUser: IUser = {} as IUser;
  houseId: number = -1;
  numberOfNights = 1;
  totalPrice = 0;
  invalidDates: boolean = false;

  constructor(private _router: Router,
    private _houseService: HouseService,
    private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.houseId = + params['id'];
      this.getHouse(this.houseId);
      this.endDateMin.setDate(this.endDateMin.getDate() + 1); // Add one day
      this.endDateMinString = new Date(this.endDateMin).toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
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
          this.totalPrice = this.newHouse.Price;
          // this.updateDays();
          console.log("New House: ", this.newHouse);
        },
        (error: any) => {
          console.error('Error loading house for edit: ', error);
        }
      );
  }

  isObjectEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  // Function to handle date changes in the order area
  updateDays(): void {
    const startDateValue = (this.startDateInput.nativeElement as HTMLInputElement).value;
    const endDateValue = (this.endDateInput.nativeElement as HTMLInputElement).value;
    const newstartDate = new Date(startDateValue);
    const newendDate = new Date(endDateValue);

    // Calculate the difference in milliseconds
    const differenceInMs = newendDate.getTime() - newstartDate.getTime();

    // Convert milliseconds to days
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));


    // Check if the date difference is negative, if it is, type out error message
    if (differenceInDays <= 0) {
      this.invalidDates = true;
      this.totalPrice = 0;
      this.numberOfNights = 0;
    } else {
      // Change the values on the screen if values are valid
      this.invalidDates = false;
      this.totalPrice = differenceInDays * this.newHouse.Price;
      this.numberOfNights = differenceInDays;
    }

    console.log("Date update");
    console.log("Start date", startDateValue);
    console.log("End date", endDateValue);
    console.log('Difference in days:', differenceInDays);
  }
}
