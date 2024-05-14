import { Component } from '@angular/core';
import { AddRegionComponent } from './add-region/add-region.component';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  id: string;
  name: string;
  code: string;
  region: string;
  action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {id: '#0001', name: 'United Arab Emirates', code: 'AE', region: 'Middle East', action:''},
  {id: '#0002', name: 'India', code: 'IN', region: 'Asia', action:''},
  {id: '#0003', name: 'United Kingdom', code: 'UK', region: 'Europe', action:''},
];

@Component({
  selector: 'app-region-country',
  templateUrl: './region-country.component.html',
  styleUrl: './region-country.component.scss'
})
export class RegionCountryComponent {
  isLoading = true;
  regionData = [
    { title: 'Africa', count: '0', selected: false},
    { title: 'Asia', count: '3', selected: false},
    { title: 'Middle East', count: '15', selected: false},
    { title: 'North America', count: '5', selected: false},
    { title: 'South America', count: '5', selected: false},
    { title: 'The Caribbean', count: '0', selected: false},
    { title: 'Asia Pacific', count: '5', selected: false},
    { title: 'Central America', count: '4', selected: false},
    { title: 'Oceania', count: '0', selected: false},
    { title: 'Europe ', count: '5', selected: false},
    { title: 'Eastern Europe ', count: '1', selected: false},
  ];
  regionCard(index: number) {
    this.regionData.forEach((region, i) => {
      if (i === index) {
        region.selected = true;
      } else {
        region.selected = false;
      }
    });
  }
  displayedColumns: string[] = ['id', 'name', 'code', 'region', 'action'];
  dataSource = ELEMENT_DATA;
  constructor(private matDialog:MatDialog){}
  addRegion(){
    this.matDialog.open(AddRegionComponent, {
      width:"600px"
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
