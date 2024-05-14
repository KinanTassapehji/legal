import { Component, EventEmitter, Output } from '@angular/core';
import { LicenseService } from '../../../services/license.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-license',
  templateUrl: './create-license.component.html',
  styleUrl: './create-license.component.scss'
})
export class CreateLicenseComponent {
  sub!: Subscription
  @Output() licenseAdded: EventEmitter<void> = new EventEmitter<void>();
  constructor(private licenseService: LicenseService, private dialogRef: MatDialogRef<CreateLicenseComponent>) { }

  addLicense(model: any) {
    let formData = { "Name": model.Name, "Email": model.Email, "PhoneNumber": model.PhoneNumber };
    this.sub = this.licenseService.createLicense(formData).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.licenseAdded.emit();
        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        console.log('err', err);
        // Handle error response, maybe show an error message
        console.error('Error creating application instance', err);
      }
    });
  }
}
