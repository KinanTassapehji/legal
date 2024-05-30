import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { ApplicationInstanceService } from '../../../services/application-instance.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IApplication } from '../../../interfaces/application';
import { IAccount } from '../../../interfaces/account';
import { Subscription } from 'rxjs';
import { IApplicationInstance } from '../../../interfaces/application-instance';
import { ITenant } from '../../../interfaces/tenant';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-update-application-instance',
  templateUrl: './update-application-instance.component.html',
  styleUrl: './update-application-instance.component.scss'
})
export class UpdateApplicationInstanceComponent implements OnInit, OnDestroy {
  @Output() applicationInstanceUpdated: EventEmitter<void> = new EventEmitter<void>();

  applicationInstance: IApplicationInstance = {} as IApplicationInstance;
  accounts: IAccount[] = [];
  sub!: Subscription;
  errorMessage = '';
  progressBar = false;
  constructor(
    private accountService: AccountService,
    private applicationInstanceService: ApplicationInstanceService,
    private dialogRef: MatDialogRef<UpdateApplicationInstanceComponent>,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, applications: IApplication[] }) {
  }

  ngOnInit(): void {
    this.progressBar = true;
    this.getApplicationInstanceById(this.data.id);
    this.getAccounts();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getApplicationInstanceById(applicationInstanceId: number) {
    this.sub = this.applicationInstanceService.getApplicationInstanceById(applicationInstanceId).subscribe(
      (response: IApplicationInstance | undefined) => {
        if (response) {
          this.applicationInstance = response;
        } else {
          console.error('Application Instance details not found');
        }
      },
      (error: any) => {
        console.error('Error retrieving application data:', error);
      }
    );
  }

  getAccounts() {
    this.sub = this.accountService.getAccountsAll().subscribe({
      next: accounts => {
        this.accounts = accounts;
        this.progressBar = false;
      },
      error: err => this.errorMessage = err
    });
  }

  updateApplicationInstance() {
    this.commonService.showAndHideProgressBar(true);
    const requestBody = {
      id: this.applicationInstance.id,
      name: this.applicationInstance.name,
      applicationId: this.applicationInstance.application.id,
      accountId: this.applicationInstance.account.id,
      tenants: this.applicationInstance.tenants
    };
    this.sub = this.applicationInstanceService.updateApplicationInstance(requestBody).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.applicationInstanceUpdated.emit(response.data.id);
        this.commonService.showAndHideProgressBar(false);
        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error updating application instance', err);
      }
    });
  }

  addNewTenant(applicationInstanceId: number, event: any) {
    const newTenant: ITenant = {
      name: '',
      email: '',
      url: '',
      applicationInstanceId: applicationInstanceId
    };
    this.applicationInstance.tenants.push(newTenant);
    event.preventDefault();
  }

  removeTenant(index: number) {
    this.applicationInstance.tenants.splice(index, 1);
  }
}
