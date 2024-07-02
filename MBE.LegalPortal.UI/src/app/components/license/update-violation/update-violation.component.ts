import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { LicenseService } from '../../../services/license.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GetUpdateFailedMessage } from '../../../constants/messages-constants';
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
    private matDialog: MatDialog) { }

  updateState() {
    this.progressBar = true;
    let state = { Id: this.data, ViolationState: this.ViolationState, ResolvedReason: this.ResolvedReason };
    this.sub = this.licenseService.updateViolationState(state).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.violationUpdated.emit();
        this.progressBar = false;
        // Close the dialog
        this.dialogRef.close();
      },
      error: err => {
        let errorMessage = GetUpdateFailedMessage("Overridden State");
        console.error('Error updating Overridden State', err);
        if (err && err.error && err.error.messages) {
          errorMessage = err.error.messages.join(', ');
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
