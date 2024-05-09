import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.scss'
})
export class AddAccountComponent implements  OnDestroy {
  @Output() accountsAdded: EventEmitter<void> = new EventEmitter<void>();
  Name: string = '';
  Email: string = '';
  PhoneNumber: string = '';
  sub!: Subscription;
  constructor(private accountService: AccountService, private dialogRef: MatDialogRef<AddAccountComponent>) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  addAccount(model: any) {
    let formData = { "Name": model.Name, "Email": model.Email, "PhoneNumber": model.PhoneNumber };
    this.sub = this.accountService.createAccounts(formData).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.accountsAdded.emit();
        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error creating application instance', err);
      }
    });
  }

}
