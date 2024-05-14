import { Component } from '@angular/core';
import { CreateLicenseComponent } from './create-license/create-license.component';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  application: string;
  accountname: string;
  tenant: string;
  subscription: string;
  environment: string;
  expirydate: string;
  expiryaction: string;
  action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {application: 'datahub', accountname: 'Mubadala', tenant: 'Mubadala', subscription: 'Gold', environment: 'staging', expirydate: '01-01-2025', expiryaction: 'Auto Renew', action:''},
  {application: 'datahub', accountname: 'PMO', tenant: 'PMO', subscription: 'Silver', environment: 'production', expirydate: '01-01-2025', expiryaction: 'Auto Renew', action:''},
  {application: 'datahub', accountname: 'TEC', tenant: 'TEC', subscription: 'Diamond', environment: 'production', expirydate: '01-01-2025', expiryaction: 'Auto Renew', action:''},
];

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss'
})
export class LicenseComponent {
  displayedColumns: string[] = ['application', 'accountname', 'tenant', 'subscription', 'environment', 'expirydate',  'expiryaction', 'action'];
  dataSource = ELEMENT_DATA;
  isLoading = true;
  constructor(private matDialog:MatDialog){}
  createLicense(){
    this.matDialog.open(CreateLicenseComponent, {
      width:"600px"
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
