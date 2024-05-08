import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../services/application.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Base_Media_Url } from '../../../constants/apis-constants';
import { MediaService } from '../../../services/media.service';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.scss'
})
export class AddApplicationComponent {
  @Output() applicationAdded: EventEmitter<void> = new EventEmitter<void>();

  applicationName: string = '';
  applicationImage: string | undefined;
  applicationImageUrl: string | undefined;
  constraints: any[] = [{}];
  sub!: Subscription;
  constructor(private applicationService: ApplicationService, private mediaService: MediaService, private dialogRef: MatDialogRef<AddApplicationComponent>) { }

  addApplication() {
    const requestBody = {
      name: this.applicationName,
      image: this.applicationImage,
      applicationConstraints: this.constraints
    };

    this.sub = this.applicationService.createApplication(requestBody).subscribe({
      next: () => {
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
    const folder = 'Applications'; // Specify the folder here
    const file: File = event.target.files[0];
    const formData = new FormData();

    formData.append('file', file);

    // Use the mediaService to handle the upload
    this.mediaService.UploadImage(folder, formData).subscribe({
      next: (response: any) => {
        this.applicationImage = response.data;
        this.applicationImageUrl = `${Base_Media_Url}/${response.data}`; // Display the uploaded image
      },
      error: (error: any) => {
        // Handle error
        console.error('Upload failed:', error);
        // Reset the image-related properties
        this.applicationImage = '';
        this.applicationImageUrl = '';
      }
    });
  }

  removeImage() {
    this.applicationImage = undefined;
    this.applicationImageUrl = undefined;
  }

  addNewConstraint() {
    this.constraints.push({ key: '', defaultAction: '' });
  }

  removeConstraint(index: number) {
    this.constraints.splice(index, 1);
  }
}
