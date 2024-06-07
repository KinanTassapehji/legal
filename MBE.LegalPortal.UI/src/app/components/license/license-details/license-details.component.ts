import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViolationConstraintsComponent } from '../violation-constraints/ViolationConstraintsComponent';
import { UpdateViolationComponent } from '../update-violation/update-violation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseService } from '../../../services/license.service';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-license-details',
  templateUrl: './license-details.component.html',
  styleUrl: './license-details.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LicenseDetailsComponent {
  isLoading = true;
  progressBar = false;
  licenseId: any;
  sub!: Subscription;
  subscriptionPlanName: string = '';
  licenseType: string = '';
  expiryDate: string = '';
  expiryAction: string = '';
  violation: any[] = [];
  totalCount = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  VIOLATION_ELEMENT_DATA: any[] = [];
  CONSTRAINTS_ELEMENT_DATA: any[] = [];
  dataSource = new MatTableDataSource(this.VIOLATION_ELEMENT_DATA);
  displayedColumns: string[] = ['violationid', 'violationdate', 'licensestate', 'overriddenstate', 'resolveddate', 'message','action'];
  displayedColumnsConstraint: string[] = ['constraintkey', 'constraintkevalue'];
  dataConstraints = new MatTableDataSource(this.CONSTRAINTS_ELEMENT_DATA);
  machinesSoruce: any[] = [];
  machineData : any[] =[]; 
  licneseLoaderItems = new Array(2);
  licenseDetailsCardData: any[] = [];
  licenseConstraints: any[] = [];
  constructor(private matDialog: MatDialog, private rounter: ActivatedRoute, private licenseService: LicenseService) { }

  ngOnInit(): void {
    this.licenseId = this.rounter.snapshot.params['id'];
    this.getLicenseDetails();
  }

  getLicenseDetails() {
    this.sub = this.licenseService.getLicenseById(this.licenseId).subscribe({
      next: responseLicense => {
        console.log('responseLicense', responseLicense);
        var data = responseLicense;
        var SubscriptionPlan = {
          label: 'Subscription Plan',
          title: data.subscriptionPlan.name,
          icon: 'ballot'
        };
        var LicenseType = {
          label: 'License Type',
          title: data.licenseType,
          icon: 'description'
        };
        var ExpiryDate = {
          label: 'Expiry Date',
          title: formatDate(data.expiryDate, 'dd-MM-yyyy', 'en-US'),
          icon: 'today'
        };
        var ExpiryAction = {
          label: 'Expiry Action',
          title: data.expiryAction,
          icon: 'info'
        };
        this.licenseConstraints = data.constraints;
        this.machinesSoruce = data.machines;
        this.licenseDetailsCardData.push(SubscriptionPlan);
        this.licenseDetailsCardData.push(LicenseType);
        this.licenseDetailsCardData.push(ExpiryDate);
        this.licenseDetailsCardData.push(ExpiryAction);
        this.createViolationObjects();
        this.loadConstraints();
        this.loadMachines();
      }
    });
  }

  loadConstraints() {
    this.CONSTRAINTS_ELEMENT_DATA = [];
    for (var i = 0; i < this.licenseConstraints.length; i++) {
      var LisenceConstraints = {
        constraintkey: this.licenseConstraints[i].key,
        constraintkevalue: this.licenseConstraints[i].value
      };
      this.CONSTRAINTS_ELEMENT_DATA.push(LisenceConstraints);
    }
    this.dataConstraints = new MatTableDataSource(this.CONSTRAINTS_ELEMENT_DATA);
  }

  loadMachines() {
    this.machineData = [];
    for (var m = 0; m < this.machinesSoruce.length; m++) {
      this.machineData.push({ title: this.machinesSoruce[m].macAddress, Id: this.machinesSoruce[m].id });
    }
  }

  createViolationObjects() {
    this.progressBar = true;
    this.VIOLATION_ELEMENT_DATA = [];
    this.violation = [];
    this.sub = this.licenseService.getViolationByLicenseId(this.licenseId, this.pageIndex + 1, this.pageSize).subscribe({
      next: responseViolation => {
        this.totalCount = responseViolation.totalCount;
        this.pageSize = responseViolation.pageSize;
        this.pageIndex = responseViolation.page - 1;
        this.violation = responseViolation.data;
        if (this.violation.length > 0) {
          for (var i = 0; i < this.violation.length; i++) {
            let _violationid = this.violation[i].id;
            let _violationdate = formatDate(this.violation[i].violationDate, 'dd-MM-yyyy', 'en-US');
            let _licenseState = this.violation[i].licenseState;
            let _messages = JSON.parse(this.violation[i].messages);
            let _violationState = this.violation[i].violationState;
            let _tag = _licenseState.toString().toLowerCase() === 'NoViolation' ? 'no-violation' : _licenseState.toString().toLowerCase();
            let _violationStateTag = _violationState.toString().toLowerCase() === 'NoViolation' ? 'no-violation' : _violationState.toString().toLowerCase();
            let _resolvedDate = this.violation[i].resolvedDate ?? "N/A";
            this.VIOLATION_ELEMENT_DATA.push({
              violationid: _violationid,
              violationdate: _violationdate,
              licensestate: '<div class="violation-tag ' + _tag + '">' + _licenseState + '</div>',
              overriddenstate: '<div class="violation-tag ' + _violationStateTag + '">' + _violationState + '</div>',
              resolveddate: _resolvedDate,
              message: '<div class="violation-message">' + _messages + '</div>',
              action: ''
            });
          }
        }
        this.dataSource = new MatTableDataSource(this.VIOLATION_ELEMENT_DATA);
        this.isLoading = false;
        this.progressBar = false;
      }
    });
  }

  violationConstraints(id: any) {
    this.matDialog.open(ViolationConstraintsComponent, {
      width: "600px",
      data: this.violation.filter(x => x.id === id)[0].violationConstraints,
    });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.createViolationObjects();
  }

  updateViolation(){
    this.matDialog.open(UpdateViolationComponent, {
      width:"600px"
    });
  }

  showInfo(id:any) {

  }
}
