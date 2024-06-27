import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { ApplicationInstanceService } from '../../../services/application-instance.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IApplication } from '../../../interfaces/application';
import { IAccount } from '../../../interfaces/account';
import { Subscription } from 'rxjs';
import { IApplicationInstance } from '../../../interfaces/application-instance';
import { ITenant } from '../../../interfaces/tenant';
import { GetConflictMessage, GetUpdateFailedMessage } from '../../../constants/messages-constants';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';

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
  modelName: string = 'Application instance';

  constructor(
    private matDialog: MatDialog,
    private accountService: AccountService,
    private applicationInstanceService: ApplicationInstanceService,
    private dialogRef: MatDialogRef<UpdateApplicationInstanceComponent>,
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
          // Remove 'https://' from each URL of each tenant
          if (response.tenants) {
            response.tenants.forEach(tenant => {
              if (tenant.url.startsWith('https://')) {
                tenant.url = tenant.url.slice(8);  // Remove 'https://'
              }
            });
          }

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
      error: err => {
        this.errorMessage = err
        this.progressBar = false;
      }
    });
  }

  updateApplicationInstance() {
    this.progressBar = true;
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
        // Close the dialog
        this.dialogRef.close();
        this.progressBar = false;
      },
    error: err => {
      let errorMessage = GetUpdateFailedMessage(this.modelName);
      if (err.status === 409) {
        // Handle 409 Conflict as a successful response
        errorMessage = GetConflictMessage(this.modelName);
      }
      else {
        // Extract the detailed error message if available
        console.error('Error updating application instance', err);
        if (err && err.error && err.error.messages) {
          errorMessage = err.error.messages.join(', ');
        }
      }
      // Display the error message in a dialog
      this.matDialog.open(ErrorPopupComponent, {
        width: '500px',
        disableClose: true, // Prevent closing the dialog by clicking outside
        data: { title: 'Error', message: errorMessage }
      });
      this.progressBar = false;
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
