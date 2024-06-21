import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../services/application.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Base_Media_Url } from '../../../constants/apis-constants';
import { MediaService } from '../../../services/media.service';
import { ViolationPolicy } from '../../../enums/ViolationPolicy';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';
import { GetConflictMessage, GetCreateFailedMessage } from '../../../constants/messages-constants';

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
  violationPolicies = Object.keys(ViolationPolicy);
  sub!: Subscription;
  progressBar = false;
  modelName: string = 'Application';

  constructor(private matDialog: MatDialog, private applicationService: ApplicationService,
    private mediaService: MediaService,
    private dialogRef: MatDialogRef<AddApplicationComponent>) { }

  addApplication() {
    this.progressBar = true
    const requestBody = {
      name: this.applicationName,
      image: this.applicationImage,
      applicationConstraints: this.constraints
    };

    this.sub = this.applicationService.createApplication(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.applicationAdded.emit();
        this.progressBar = false;
        // Close the dialog
        this.dialogRef.close();
      },
      error: err => {
        let errorMessage = GetCreateFailedMessage(this.modelName);
        if (err.status === 409) {
          // Handle 409 Conflict as a successful response
          errorMessage = GetConflictMessage(this.modelName);
        }
        else {
          // Extract the detailed error message if available
          console.error('Error adding application');
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

  handleImageInput(event: any) {
    const folder = 'Applications'; // Specify the folder here
    const file: File = event.target.files[0];
    const formData = new FormData();

    formData.append('file', file);

    // Use the mediaService to handle the upload
    this.mediaService.UploadImage(folder, formData).subscribe({
      next: (response: any) => {
        this.applicationImage = response.data;
        this.applicationImageUrl = `${Base_Media_Url}${response.data}`; // Display the uploaded image
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

  addNewConstraint(event: any) {
    this.constraints.push({ key: '', defaultAction: '' });
    event.preventDefault();
  }

  removeConstraint(index: number) {
    this.constraints.splice(index, 1);
  }
}
