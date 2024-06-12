import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../services/application.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IApplicationDetails } from '../../../interfaces/application-details';
import { Base_Media_Url } from '../../../constants/apis-constants';
import { MediaService } from '../../../services/media.service';
import { ViolationPolicy } from '../../../enums/ViolationPolicy';

@Component({
  selector: 'app-update-application',
  templateUrl: './update-application.component.html',
  styleUrl: './update-application.component.scss'
})
export class UpdateApplicationComponent implements OnInit, OnDestroy {
  @Output() applicationUpdated: EventEmitter<void> = new EventEmitter<void>();

  applicationImageUrl: string | undefined;
  application: IApplicationDetails = {} as IApplicationDetails;
  violationPolicies = Object.keys(ViolationPolicy);
  sub!: Subscription;
  progressBar = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: number, private applicationService: ApplicationService, private mediaService: MediaService, private dialogRef: MatDialogRef<UpdateApplicationComponent>) { }

  ngOnInit(): void {
    this.progressBar = true;
    this.getApplicationById(this.data);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }  }

  getApplicationById(applicationId: number) {
    this.sub = this.applicationService.getApplicationById(applicationId).subscribe(
      (response: IApplicationDetails | undefined) => {
        if (response) {
          this.application = response;
          this.applicationImageUrl = this.application.image;
          this.progressBar = false;
        } else {
          console.error('Application details not found');
        }
      },
      (error: any) => {
        console.error('Error retrieving application data:', error);
      }
    );
  }

  updateApplication() {
        this.progressBar = true;
    const requestBody = {
      id: this.application?.id,
      name: this.application?.name,
      image: this.application?.image?.replace(Base_Media_Url, ''),
      applicationConstraints: this.application?.applicationConstraints
    };

    this.sub = this.applicationService.updateApplication(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.applicationUpdated.emit();
        // Close the dialog
        this.dialogRef.close();
        this.progressBar = true;
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error updating application', err);
        this.progressBar = true;
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
        this.application.image = response.data;
        this.applicationImageUrl = `${Base_Media_Url}${response.data}`; // Display the uploaded image
      },
      error: (error: any) => {
        // Handle error
        console.error('Upload failed:', error);
        // Reset the image-related properties
        this.application.image = '';
      }
    });
    }

  removeImage() {
    this.application.image = undefined;
    this.applicationImageUrl = undefined;
  }

  addNewConstraint(event: any) {
    this.application?.applicationConstraints.push({ key: '', label: '', defaultAction: '' });
    event.preventDefault();
  }

  removeConstraint(index: number) {
    this.application?.applicationConstraints.splice(index, 1);
  }
}
