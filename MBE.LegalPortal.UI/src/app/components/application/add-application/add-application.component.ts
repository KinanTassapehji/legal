import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../services/application.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.scss'
})
export class AddApplicationComponent {
  @Output() applicationAdded: EventEmitter<void> = new EventEmitter<void>();

  applicationName: string = '';
  applicationImage: string = '';
  constraints: any[] = [{}];
  sub!: Subscription;
  constructor(private applicationService: ApplicationService, private dialogRef: MatDialogRef<AddApplicationComponent>) { }

  addApplication() {
    const requestBody = {
      name: this.applicationName,
      image: this.applicationImage,
      applicationConstraints: this.constraints
    };

    this.sub = this.applicationService.createApplication(requestBody).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.applicationAdded.emit();

        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error creating application', err);
      }
    });
  }

  handleImageInput(event: any) {
    const file: File = event.target.files[0];
    // Handle the selected image file here
    console.log('Selected image file:', file);
    // You can perform operations like uploading the file to a server or displaying it in the UI
    this.applicationImage = file.name;
  }

  addNewConstraint() {
    this.constraints.push({ key: '', defaultAction: '' });
  }

  removeConstraint(index: number) {
    this.constraints.splice(index, 1);
  }
}
