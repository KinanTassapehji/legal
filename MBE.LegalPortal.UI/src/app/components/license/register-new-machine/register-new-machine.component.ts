import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  volumeAddress: string = '';
  domain: string = '';
  sub!: Subscription;
  progressBar = false;

  constructor(private machineService: MachineService, private dialogRef: MatDialogRef<RegisterNewMachineComponent>) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addMachine(model: any) {
    this.progressBar = true;
    let requestBody = {
      "macAddress": model.macAddress,
      "processorId": model.processorId,
      "volumeAddress": model.volumeAddress,
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
