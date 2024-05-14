import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IApplication } from '../../../interfaces/application';
import { AccountService } from '../../../services/account.service';
import { IAccount } from '../../../interfaces/account';
import { ApplicationInstanceService } from '../../../services/application-instance.service';

@Component({
  selector: 'app-add-application-instance',
  templateUrl: './add-application-instance.component.html',
  styleUrl: './add-application-instance.component.scss'
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
  
  constructor(
    private accountService: AccountService,
    private applicationInstanceService: ApplicationInstanceService,
    private dialogRef: MatDialogRef<AddApplicationInstanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { applications: IApplication[] })
  {
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
    const requestBody = {
      name: this.name,
      applicationId: this.applicationId,
      accountId: this.accountId,
      tenants: this.tenants
    };

    this.sub = this.applicationInstanceService.createApplicationInstance(requestBody).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.applicationInstanceAdded.emit(response.data.id);

        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error creating application instance', err);
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
