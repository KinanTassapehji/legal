import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AccountService } from '../../../services/account.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GetConflictMessage, GetUpdateFailedMessage } from '../../../constants/messages-constants';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.scss'
})

export class UpdateAccountComponent {
  @Output() accountUpdated: EventEmitter<void> = new EventEmitter<void>();
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  accountId: number = 0;
  sub!: Subscription;
  progressBar = false;
  modelName: string = 'Account';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private matDialog: MatDialog, private accountService: AccountService, private dialogRef: MatDialogRef<UpdateAccountComponent>) { }

  ngOnInit(): void {
    this.getAccountDetails(this.data);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getAccountDetails(data: any) {
    if (data) {
      this.name = data.name;
      this.email = data.email;
      this.phoneNumber = data.phoneNumber;
      this.accountId = data.id;
    }
  }

  updateAccount(data: any) {
    this.progressBar = true;
    const requestBody = {
      id: this.accountId,
      name: data.name,
      email: data.email,
      phoneNumber: '+' + data.phoneNumber
    };
    this.sub = this.accountService.updateAccount(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.accountUpdated.emit();
        this.progressBar = false;
        // Close the dialog
        this.dialogRef.close();
      },
      error: err => {
        let errorMessage = GetUpdateFailedMessage(this.modelName);
        if (err.status === 409) {
          // Handle 409 Conflict as a successful response
          errorMessage = GetConflictMessage(this.modelName);
        }
        else {
          // Extract the detailed error message if available
          console.error('Error updating account', err);
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
}
