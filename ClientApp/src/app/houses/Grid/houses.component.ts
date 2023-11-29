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
  selectedSort: number = 0;

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

  sortHouses(event: any) {
    const type = Number(this.selectedSort);
    if (type === 1) {
      console.log("Sort lohi", this.selectedSort);
      this.filteredHouses.sort((a, b) => a.Price - b.Price);
    } else if (type === -1) {
      console.log("Sort hilo", this.selectedSort);
      this.filteredHouses.sort((a, b) => b.Price - a.Price);
    }

    else if (type === 2) {
      console.log("Sort A-Z", this.selectedSort);
      this.filteredHouses.sort((a, b) => a.Address.localeCompare(b.Address, 'sv'));
    } else if (type === -2) {
      console.log("Sort Z-A", this.selectedSort);
      this.filteredHouses.sort((a, b) => b.Address.localeCompare(a.Address, 'sv'));
    }






     else {
      console.log("Sort??", this.selectedSort);
      this.filteredHouses.sort((a, b) => a.HouseId - b.HouseId);
    }
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
