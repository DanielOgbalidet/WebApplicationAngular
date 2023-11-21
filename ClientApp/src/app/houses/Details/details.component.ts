import { Component, OnInit } from '@angular/core';
import { IHouse } from '../house';
import { Router } from '@angular/router';
import { HouseService } from '../houses.service';

@Component({
  selector: 'app-details-component',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit {
  constructor(private _router: Router, private _houseService: HouseService) { }

  ngOnInit(): void {
    console.log('Details')
  }
}

