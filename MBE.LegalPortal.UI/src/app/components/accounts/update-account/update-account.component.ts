import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AccountService } from '../../../services/account.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private accountService: AccountService, private dialogRef: MatDialogRef<UpdateAccountComponent>) { }

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
      name: data.Name,
      email: data.Email,
      phoneNumber: '+' +data.PhoneNumber
    };
    this.sub = this.accountService.updateAccount(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.accountUpdated.emit();
        this.progressBar = false;
        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error updating account', err);
        this.progressBar = false;
      }
    });
  }
}
