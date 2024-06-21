import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IApplication } from '../../../interfaces/application';
import { AccountService } from '../../../services/account.service';
import { IAccount } from '../../../interfaces/account';
import { ApplicationInstanceService } from '../../../services/application-instance.service';
import { GetConflictMessage, GetCreateFailedMessage } from '../../../constants/messages-constants';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';

@Component({
  selector: 'app-add-application-instance',
  templateUrl: './add-application-instance.component.html',
  styleUrl: './add-application-instance.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AddApplicationInstanceComponent implements OnInit, OnDestroy {
  @Output() applicationInstanceAdded: EventEmitter<void> = new EventEmitter<void>();

  name: string = '';
  applicationId: number = 0;
  accountId: number = 0;
  tenants: any[] = [{}];
  accounts: IAccount[] = [];
  sub!: Subscription;
  errorMessage = '';
  progressBar = false;
  modelName: string = 'Application instance';

  constructor(
    private matDialog: MatDialog,
    private accountService: AccountService,
    private applicationInstanceService: ApplicationInstanceService,
    private dialogRef: MatDialogRef<AddApplicationInstanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { applications: IApplication[] }) {
  }

  ngOnInit(): void {
    this.getAccounts();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getAccounts() {
    this.sub = this.accountService.getAccountsAll().subscribe({
      next: accounts => {
        this.accounts = accounts;
      },
      error: err => this.errorMessage = err
    });
  }

  addApplicationInstance() {
    this.progressBar = true;
    const requestBody = {
      name: this.name,
      applicationId: this.applicationId,
      accountId: this.accountId,
      tenants: this.tenants.map(tenant => ({
        ...tenant,
        url: `https://${tenant.url}`  // Add 'https://' to the url
      }))
    };

    this.sub = this.applicationInstanceService.createApplicationInstance(requestBody).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.applicationInstanceAdded.emit(response.data.id);
        this.progressBar = false;
        // Close the dialog
        this.dialogRef.close();
      },
    error: err => {
      let errorMessage = GetCreateFailedMessage(this.modelName);
      if (err.status === 409) {
        // Handle 409 Conflict as a successful response
        errorMessage = GetConflictMessage(this.modelName);
      }
      else {
        // Extract the detailed error message if available
        console.error('Error creating application instance', err);
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

  addNewTenant(event: any) {
    this.tenants.push({ name: '', email: '', url: '' });
    event.preventDefault();
  }

  removeTenant(index: number) {
    this.tenants.splice(index, 1);
  }
}
