import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViolationConstraintsComponent } from '../violation-constraints/violation-constraints.component';
import { UpdateViolationComponent } from '../update-violation/update-violation.component';

export interface PeriodicElement {
  violationid: string;
  violationdate: string;
  licensestate: string;
  overriddenstate: string;
  resolveddate: string;
  message: string;
  action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {violationid: '#001', violationdate: '07-01-2025', licensestate: '<div class="violation-tag silent">Silent</div>', overriddenstate: '<div class="violation-tag silent">Silent</div>', resolveddate: '01-01-2025', message: '<div class="violation-message">Lorem ipsum dolor sit amet consectetur. Scelerisque vitae donec diam morbi sollicitudin congue enim.</div>', action:''},
  {violationid: '#002', violationdate: '05-01-2024', licensestate: '<div class="violation-tag default">Default</div>', overriddenstate: '<div class="violation-tag default">Default</div>', resolveddate: '01-01-2025', message: '<div class="violation-message">Lorem ipsum dolor sit amet consectetur. Pharetra pharetra ornare imperdiet elementum semper varius a ultrices.</div>', action:''},
  {violationid: '#003', violationdate: '11-01-2024', licensestate: '<div class="violation-tag breach">Breach</div>', overriddenstate: '<div class="violation-tag breach">Breach</div>', resolveddate: '01-01-2025', message: '<div class="violation-message">Lorem ipsum dolor sit amet consectetur. Nibh ullamcorper velit dignissim felis penatibus hendrerit ac nullam lacinia.</div>', action:''},
  {violationid: '#004', violationdate: '11-01-2024', licensestate: '<div class="violation-tag no-violation">No Violation</div>', overriddenstate: '<div class="violation-tag no-violation">No Violation</div>', resolveddate: '01-01-2025', message: '<div class="violation-message">Lorem ipsum dolor sit amet consectetur. Nibh ullamcorper velit dignissim felis penatibus hendrerit ac nullam lacinia.</div>', action:''},
];
export interface PeriodicElements {
  constraintkey: string;
  constraintkevalue: string;
}
const ELEMENT_DATA1: PeriodicElements[] = [
  {constraintkey: 'Max Users', constraintkevalue: '40'},
  {constraintkey: 'Max Devices', constraintkevalue: '15'},
  {constraintkey: 'Max Surveys', constraintkevalue: '50'},
];

@Component({
  selector: 'app-license-details',
  templateUrl: './license-details.component.html',
  styleUrl: './license-details.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LicenseDetailsComponent {
  isLoading = true;  
  displayedColumns: string[] = ['violationid', 'violationdate', 'licensestate', 'overriddenstate', 'resolveddate', 'message','action'];
  dataSource = ELEMENT_DATA;
  displayedColumnsConstraint: string[] = ['constraintkey', 'constraintkevalue'];
  dataSources = ELEMENT_DATA1;
  machineData = [
    { title: 'Machine 1',},
    { title: 'Machine 2',},
    { title: 'Machine 3',},
    { title: 'Machine 4',},
    { title: 'Machine 5',},
  ]; 
  licneseLoaderItems = new Array(2);
  licenseDetailsCardData = [
    { label: 'Subscription Plan', title: 'Diamond', icon: 'ballot'},
    { label: 'License Type', title: 'Unlimited', icon: 'description'},
    { label: 'Expiry Date', title: '01-01-2050', icon: 'today'},
    { label: 'Expiry Action', title: 'Auto Renew', icon: 'info'},
  ];
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
  constructor(private matDialog:MatDialog){}
  violationConstraints(){
    this.matDialog.open(ViolationConstraintsComponent, {
      width:"600px"
    });
  }
  updateViolation(){
    this.matDialog.open(UpdateViolationComponent, {
      width:"600px"
    });
  }
}
