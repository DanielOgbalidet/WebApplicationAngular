import { Component, OnInit } from '@angular/core';
import { IHouse } from '../house';
import { Router } from '@angular/router';
import { HouseService } from '../houses.service';

@Component({
  selector: 'app-houses-component',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.css']
})

export class HousesComponent implements OnInit {
  viewTitle: string = 'Grid';
  displayImage: boolean = true;
  houses: IHouse[] = [];
  baseImgUrl: string;

  constructor(private _router: Router, private _houseService: HouseService) {
    this.baseImgUrl = "/assets/images/";
  }

  private _listFilter: string = '';

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredHouses = this.performFilter(value);
  }

  getHouses(): void {
    this._houseService.getHouses().subscribe(data => {
      console.log("All", JSON.stringify(data));
      this.houses = data;
      this.filteredHouses = this.houses;
    });
  }

  filteredHouses: IHouse[] = this.houses;

  performFilter(filterBy: string): IHouse[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.houses.filter((house: IHouse) =>
      house.Address.toLocaleLowerCase().includes(filterBy));
  }

  toggleImage(): void {
    this.displayImage = !this.displayImage;
  }

  navigateToHouseform() {
    this._router.navigate(['/houseform']);
  }

  ngOnInit(): void {
    this.getHouses();
  }
}
