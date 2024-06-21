import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GetConflictMessage, GetCreateFailedMessage } from '../../../constants/messages-constants';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss'
})

export class AddAccountComponent implements OnDestroy {
  @Output() accountsAdded: EventEmitter<void> = new EventEmitter<void>();
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  sub!: Subscription;
  progressBar = false;
  modelName: string = 'Account';

  constructor(private matDialog: MatDialog, private accountService: AccountService, private dialogRef: MatDialogRef<AddAccountComponent>) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addAccount(model: any) {
    this.progressBar = true;
    let requestBody = {
      "name": model.name,
      "email": model.email,
      "phoneNumber": '+' + model.phoneNumber
    };

    this.sub = this.accountService.createAccount(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.accountsAdded.emit();
        // Close the dialog
        this.dialogRef.close();
        this.progressBar = false;
      },
      error: err => {
        let errorMessage = GetCreateFailedMessage(this.modelName);
        if (err.status === 409) {
          // Handle 409 Conflict as a successful response
          errorMessage = GetConflictMessage(this.modelName);
        }
        else {
          // Extract the detailed error message if available
          console.error('Error adding account', err);
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
