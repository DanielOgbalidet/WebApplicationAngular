import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IHouse } from '../house';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../houses.service';
import { IUser } from '../../users/user';
import { IOrder } from '../../Order/order';

@Component({
  selector: 'app-details', // Specify the selector for the component
  templateUrl: './details.component.html', // Path to the HTML template
  styleUrls: ['./details.component.css'] // Array of CSS stylesheets
})

export class DetailsComponent implements OnInit {
  @ViewChild('startDateInput') startDateInput!: ElementRef;
  @ViewChild('endDateInput') endDateInput!: ElementRef;

  // Variables to control the specific house to look at 
  startDateMin: string = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
  endDateMin: Date = new Date(this.startDateMin);
  endDateMinString: string = '';
  newHouse: IHouse = {} as IHouse; // Adjust the type according to your house object structure
  newUser: IUser = {} as IUser;
  houseId: number = -1;
  userId: number = -1;
  numberOfNights = 1;
  baseImgUrl: string;
  numberOfFiles: number = 0;
  images: string[] = [];
  totalPrice = 0;
  invalidDates: boolean = false;

  // Variable to create order
  newOrder: IOrder = {} as IOrder;
  newOrderUser: IUser = {} as IUser;

  constructor(private _router: Router,
    private _houseService: HouseService,
    private _route: ActivatedRoute) {
    this.baseImgUrl = "/assets/images/";
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._route.params.subscribe(params => {
      this.houseId = + params['id'];
      this.getHouse(this.houseId);
      this.endDateMin.setDate(this.endDateMin.getDate() + 1); // Add one day
      this.endDateMinString = new Date(this.endDateMin).toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
      this.startCarousel();
    });

    this._houseService.showId(sessionStorage.getItem("email")!).subscribe(
      (userIdValue: number) => {
        // Update the userId in the form
        this.userId = userIdValue;
      },
      (error) => {
        console.error("Error fetching userId:", error);
      }
    );
  }

  createOrder(): void {
    if (sessionStorage.getItem("email") === null) {
      this._router.navigate(['/login'])
    }
    // Creating order object to save in DB
    this.newOrder.OrderDate = new Date().toISOString().split('T')[0]; // Todays date in ISO format
    // Temp userId
    this.newOrder.UserId = 1;
    this.newOrder.HouseId = this.houseId;
    this.newOrder.UserId = this.userId;

    // Get values from input fields (startDate and endDate)
    const startDateValue = (this.startDateInput.nativeElement as HTMLInputElement).value; // Start date input
    const endDateValue = (this.endDateInput.nativeElement as HTMLInputElement).value;  // End date input

    this.newOrder.StartDate = startDateValue;
    this.newOrder.EndDate = endDateValue;
    this.newOrder.TotalPrice = this.totalPrice;

    // Creating order 
    this._houseService.createOrder(this.newOrder)
      .subscribe(response => {
        if (response.success) {
          console.log(response.message);
          this._router.navigate(['/Table'])
        }
        else {
          console.log("Order creation failed");
        }
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
          const address = this.newHouse.Address;
          this.getImages(address);
          console.log("New House: ", this.newHouse);
        },
        (error: any) => {
          console.error('Error loading house for edit: ', error);
        }
      );
  }

  getImages(address: string) {
    console.log("Address to el manzion: ", address);
    this._houseService.getImages(address).subscribe((result: any) => {
      console.log("Result: ", result);
      this.numberOfFiles = result && result.imgCount ? result.imgCount : 0;
      this.images = result && result.images ? result.images : [];
      console.log("Number of images: ", this.numberOfFiles);
      console.log("Images: ", this.images);
    },
      error => {
        console.error("Error fetching number of files:", error);
      });
  }

  currentSlideIndex: number = 0;
  public intervalId: any;

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000); // Set the interval (in milliseconds) according to your preference
  }

  prevSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.images.length) % this.images.length;
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
  }

  isObjectEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  // Function to handle date changes in the order area
  updateDays(): void {
    const startDateValue = (this.startDateInput.nativeElement as HTMLInputElement).value;
    const endDateValue = (this.endDateInput.nativeElement as HTMLInputElement).value;

    // Turn it into date objects so we can calculate the difference in days
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
      console.log("Updated total price", this.totalPrice);
      this.numberOfNights = differenceInDays;
    }

    console.log("Date update");
    console.log("Start date", startDateValue);
    console.log("End date", endDateValue);
    console.log('Difference in days:', differenceInDays);
  }


}
