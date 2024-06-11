import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
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
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  sub!: Subscription;
  progressBar = false;

  constructor(private accountService: AccountService, private dialogRef: MatDialogRef<AddAccountComponent>) { }

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
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error creating account', err);
        this.progressBar = false;
      }
    });
  }
}
