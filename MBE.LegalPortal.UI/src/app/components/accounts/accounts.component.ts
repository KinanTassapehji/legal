import { Component } from '@angular/core';
import { AddAccountComponent } from './add-account/add-account.component';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  accountname: string;
  email: string;
  phone: string;
  applicationinstance: number;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {accountname: 'Mubadala', email: 'mubadala@mail.com', phone: '+971551234567', applicationinstance: 2, action:''},
  {accountname: 'PMO', email: 'pmo@mail.com', phone: '+971551234568', applicationinstance: 1, action:''},
  {accountname: 'TEC', email: 'tec@mail.com', phone: '+971551234569', applicationinstance: 1, action:''},
];

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  displayedColumns: string[] = ['accountname', 'email', 'phone', 'applicationinstance', 'action'];
  dataSource = ELEMENT_DATA;
  constructor(private matDialog:MatDialog){}
  addAccount(){
    this.matDialog.open(AddAccountComponent, {
      width:"600px"
    });
  }
}
