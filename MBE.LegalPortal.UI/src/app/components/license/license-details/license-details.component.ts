import { Component } from '@angular/core';

@Component({
  selector: 'app-license-details',
  templateUrl: './license-details.component.html',
  styleUrl: './license-details.component.scss'
})
export class LicenseDetailsComponent {
  isLoading = true;
  licenseData = [
    { title: 'Tenant', details: 'Tenant name'},
    { title: 'Subscription Plan', details: 'Diamond'},
    { title: 'License Type', details: 'Unlimited'},
    { title: 'Expiry Date', details: '01-01-2050'},
    { title: 'Expiry Action', details: 'Auto Renew'},
  ];
  constraintData = [
    { title: 'Constraints 1',},
    { title: 'Constraints 2',},
    { title: 'Constraints 3',},
  ];
  machineData = [
    { title: 'Machine 1',},
    { title: 'Machine 2',},
    { title: 'Machine 3',},
  ]; 
  licneseLoaderItems = new Array(2); 
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
