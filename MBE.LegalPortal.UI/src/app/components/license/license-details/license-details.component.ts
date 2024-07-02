import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViolationConstraintsComponent } from '../violation-constraints/ViolationConstraintsComponent';
import { UpdateViolationComponent } from '../update-violation/update-violation.component';
import { ActivatedRoute } from '@angular/router';
import { LicenseService } from '../../../services/license.service';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationPopupComponent } from '../../../shared/popups/confirmation-popup/confirmation-popup.component';
import { SnackbarService } from '../../../shared/custom-snackbar/snackbar.service';
import { GetCreateSuccessfullyMessage, GetDeleteFailedMessage, GetDeleteSuccessfullyMessage, GetUpdateSuccessfullyMessage } from '../../../constants/messages-constants';
import { MessageType } from '../../../enums/messageType';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';
import { RegisterNewMachineComponent } from '../register-new-machine/register-new-machine.component';
import { MachineService } from '../../../services/machine.service';
import { ExpiryType } from '../../../enums/expiryType';
import { MachineDetailsComponent } from '../machine-details/machine-details.component';

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
  displayedColumns: string[] = ['violationid', 'violationdate', 'licensestate', 'overriddenstate', 'resolveddate', 'resolvedreason', 'message', 'action'];
  displayedColumnsConstraint: string[] = ['constraintkey', 'constraintkevalue'];
  dataConstraints = new MatTableDataSource(this.CONSTRAINTS_ELEMENT_DATA);
  machinesSoruce: any[] = [];
  machineData: any[] = [];
  licneseLoaderItems = new Array(2);
  licenseDetailsCardData: any[] = [];
  licenseConstraints: any[] = [];
  constructor(private matDialog: MatDialog,
    private rounter: ActivatedRoute,
    private licenseService: LicenseService,
    private machineService: MachineService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.licenseId = this.rounter.snapshot.params['id'];
    this.getLicenseDetails();
  }

  registerNewMachine() {
    const dialogRef = this.matDialog.open(RegisterNewMachineComponent, {
      width: "600px",
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: {
        licenseId: this.licenseId, // Pass licenseId data to the child component
      }
});

    dialogRef.componentInstance.machineAdded.subscribe(() => {
      this.snackbarService.show(GetCreateSuccessfullyMessage('Machine'), MessageType.SUCCESS);
      this.getLicenseDetails(); // Refresh the details of the license
    });
  }

  getLicenseDetails() {
    this.licenseDetailsCardData = [];
    this.licenseConstraints = [];
    this.sub = this.licenseService.getLicenseById(this.licenseId).subscribe({
      next: responseLicense => {
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
        const ExpiryDate = {
          label: 'Expiry Date',
          title: data.expiryType === ExpiryType.UnLimited ? 'Uncontrolled' : formatDate(data.expiryDate, 'dd-MM-yyyy', 'en-US'),
          icon: 'today'
        };
        var ExpiryAction = {
          label: 'Expiry Action',
          title: data.expiryAction + 'Policy',
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
      let name = this.machinesSoruce[m].machineName ? `${this.machinesSoruce[m].machineName}` : `${this.machinesSoruce[m].domain}`;
      this.machineData.push({ title: name, Id: this.machinesSoruce[m].id });
    }
  }

  createViolationObjects() {
    this.progressBar = true;
    this.violation = [];
    this.VIOLATION_ELEMENT_DATA = [];
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
            let _resolvedReason = this.violation[i].resolvedReason ? this.violation[i].resolvedReason : "N/A";
            let _messages = JSON.parse(this.violation[i].messages);
            let _violationState = this.violation[i].violationState;
            let _tag = _licenseState.toString().toLowerCase() === 'NoViolation' ? 'no-violation' : _licenseState.toString().toLowerCase();
            let _violationStateTag = _violationState.toString().toLowerCase() === 'NoViolation' ? 'no-violation' : _violationState.toString().toLowerCase();
            let _resolvedDate = this.violation[i].resolvedDate ? formatDate(this.violation[i].resolvedDate, 'dd-MM-yyyy', 'en-US') : "N/A";
            this.VIOLATION_ELEMENT_DATA.push({
              violationid: _violationid,
              violationdate: _violationdate,
              licensestate: '<div class="violation-tag ' + _tag + '">' + _licenseState + '</div>',
              overriddenstate: '<div class="violation-tag ' + _violationStateTag + '">' + _violationState + '</div>',
              resolveddate: _resolvedDate,
              resolvedreason: _resolvedReason,
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

  updateViolation(violationId: any) {
    const dialogRef = this.matDialog.open(UpdateViolationComponent, {
      width: "600px",
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: violationId
    });

    dialogRef.componentInstance.violationUpdated.subscribe(() => {
      this.snackbarService.show(GetUpdateSuccessfullyMessage("Overridden State"), MessageType.SUCCESS);
      this.getLicenseDetails(); // Refresh the list of violations
    })
  }

  showInfo(id: any) {
    let getMachine = this.machinesSoruce?.filter(x => { return x.id === id; })[0];
    this.matDialog.open(MachineDetailsComponent, {
      width: "600px",
      data: `${JSON.stringify(getMachine)}`
    });
  }

  terminateMachine(id: any, machineName: any) {
    const dialogRef = this.matDialog.open(ConfirmationPopupComponent, {
      width: "400px",
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: `${machineName}`,
    });
    //
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteMachine(id, machineName);
      }
    });
  }

  deleteMachine(id: any, machineName: any) {
    this.sub = this.machineService.deleteMachineById(id).subscribe({
      next: () => {
        this.snackbarService.show(GetDeleteSuccessfullyMessage(machineName), MessageType.SUCCESS);
        // Update the UI
        this.getLicenseDetails();
      },
      error: err => {
        // Extract the detailed error message if available
        let errorMessage = GetDeleteFailedMessage(machineName);
        if (err && err.error && err.error.messages) {
          errorMessage = err.error.messages.join(', ');
        }
        // Display the error message in a dialog
        this.matDialog.open(ErrorPopupComponent, {
          width: '500px',
          disableClose: true, // Prevent closing the dialog by clicking outside
          data: { title: 'Error', message: errorMessage }
        });
      }
    });
  }
}
