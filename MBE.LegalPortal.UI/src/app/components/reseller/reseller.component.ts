import { Component } from '@angular/core';

export interface PeriodicElement {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {id: '#0001', name: 'Mobility Eye', email: 'reseller1@mobilityeye.com', phone: '+971 55000 00000', country: 'United Arab Emirates', action:''},
  {id: '#0002', name: 'Reseller 1', email: 'reseller2@mobilityeye.com', phone: '+971 55000 00001', country: 'India', action:''},
  {id: '#0003', name: 'Reseller 2', email: 'reseller3@mobilityeye.com', phone: '+971 55000 00002', country: 'United Kingdom', action:''},
];
@Component({
  selector: 'app-reseller',
  templateUrl: './reseller.component.html',
  styleUrl: './reseller.component.scss'
})
export class ResellerComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'country', 'action'];
  dataSource = ELEMENT_DATA;
}
