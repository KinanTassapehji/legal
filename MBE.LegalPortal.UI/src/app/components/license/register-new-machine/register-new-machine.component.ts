import { Component, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MachineService } from '../../../services/machine.service';
import { Subscription } from 'rxjs';
import { GetConflictMessage, GetCreateFailedMessage } from '../../../constants/messages-constants';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';

@Component({
  selector: 'app-register-new-machine',
  templateUrl: './register-new-machine.component.html',
  styleUrl: './register-new-machine.component.scss'
})
export class RegisterNewMachineComponent implements OnDestroy {
  @Output() machineAdded: EventEmitter<void> = new EventEmitter<void>();
  machineName: string = '';
  macAddress: string = '';
  processorId: string = '';
  volumeSerial: string = '';
  domain: string = '';
  sub!: Subscription;
  progressBar = false;
  modelName: string = 'Machine';

  constructor(private matDialog: MatDialog, private machineService: MachineService, private dialogRef: MatDialogRef<RegisterNewMachineComponent>, @Inject(MAT_DIALOG_DATA) public data: { licenseId: number }) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addMachine(model: any) {
    this.progressBar = true;
    let requestBody = {
      "licenseId": this.data.licenseId,
      "machineName": model.machineName,
      "macAddress": model.macAddress,
      "processorId": model.processorId,
      "volumeSerial": model.volumeSerial,
      "domain": model.domain
    };

    this.sub = this.machineService.createMachine(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.machineAdded.emit();
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
          console.error('Error adding machine', err);
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
