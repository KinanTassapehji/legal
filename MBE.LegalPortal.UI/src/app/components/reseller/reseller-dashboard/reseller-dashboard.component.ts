import { Component, ViewEncapsulation } from '@angular/core';
import { CreateUserComponent } from '../create-user/create-user.component';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {id: '#0001', name: 'John Doe', email: 'johndoe@mail.com', phone: '+971 55000 00000', country: 'United Arab Emirates', action:''},
  {id: '#0002', name: 'Harun Ward Asker', email: 'harun@mail.com', phone: '+971 55000 00001', country: 'India', action:''},
  {id: '#0003', name: 'Tarif Nazeem Moghadam', email: 'tarif@mail.com', phone: '+971 55000 00002', country: 'United Kingdom', action:''},
];
@Component({
  selector: 'app-reseller-dashboard',
  templateUrl: './reseller-dashboard.component.html',
  styleUrl: './reseller-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ResellerDashboardComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'country', 'action'];
  dataSource = ELEMENT_DATA;
  resellerName: string =  'Mobility Eye';
  resellerEmail: string =  'reseller1@mobilityeye.com';
  resellerPhone: string =  '+971 55000 00000';
  resellerCountry: string =  'United Arab Emirates';
  constructor(private matDialog:MatDialog){}
  createUser(){
    this.matDialog.open(CreateUserComponent, {
      width:"600px"
    });
  }
}
