import { Component, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MachineService } from '../../../services/machine.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-new-machine',
  templateUrl: './register-new-machine.component.html',
  styleUrl: './register-new-machine.component.scss'
})
export class RegisterNewMachineComponent implements OnDestroy {
  @Output() machineAdded: EventEmitter<void> = new EventEmitter<void>();
  macAddress: string = '';
  processorId: string = '';
  volumeSerial: string = '';
  domain: string = '';
  sub!: Subscription;
  progressBar = false;

  constructor(private machineService: MachineService, private dialogRef: MatDialogRef<RegisterNewMachineComponent>, @Inject(MAT_DIALOG_DATA) public data: { licenseId: number }) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addMachine(model: any) {
    this.progressBar = true;
    let requestBody = {
      "licenseId": this.data.licenseId,
      "macAddress": model.macAddress,
      "processorId": model.processorId,
      "volumeSerial": model.volumeSerial,
      "domain":  `https://${model.domain}`
    };

    this.sub = this.machineService.createMachine(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.machineAdded.emit();
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
