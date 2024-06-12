import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { LicenseService } from '../../../services/license.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../shared/custom-snackbar/snackbar.service';
import { GetUpdateSuccessfullyMessage } from '../../../constants/messages-constants';
import { MessageType } from '../../../enums/messageType';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';
import { ViolationPolicy } from '../../../enums/ViolationPolicy';

@Component({
  selector: 'app-update-violation',
  templateUrl: './update-violation.component.html',
  styleUrl: './update-violation.component.scss'
})

export class UpdateViolationComponent {
  @Output() violationUpdated: EventEmitter<void> = new EventEmitter<void>();
  ViolationState: string = '';
  ResolvedReason: string = '';
  violationPolicies = Object.keys(ViolationPolicy);
sub!: Subscription;
  progressBar = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateViolationComponent>,
    private licenseService: LicenseService,
    private snackbarService: SnackbarService,
    private matDialog: MatDialog) { }

  updateState() {
    this.progressBar = true;
    let state = { Id: this.data, ViolationState: this.ViolationState, ResolvedReason: this.ResolvedReason };
    this.sub = this.licenseService.updateViolationState(state).subscribe({
      next: () => {
        this.violationUpdated.emit();
        this.snackbarService.show(GetUpdateSuccessfullyMessage("violation status"), MessageType.SUCCESS);
        this.dialogRef.close();
        this.progressBar = false;
      },
      error: err => {
        this.progressBar = false;
        // Extract the detailed error message if available
        let errorMessage = GetUpdateSuccessfullyMessage("Exception");
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
