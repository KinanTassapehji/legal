import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../../services/application.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IApplicationDetails } from '../../../interfaces/application-details';
import { Base_Media_Url } from '../../../constants/apis-constants';

@Component({
  selector: 'app-update-application',
  templateUrl: './update-application.component.html',
  styleUrl: './update-application.component.scss'
})
export class UpdateApplicationComponent implements OnInit, OnDestroy {
  @Output() applicationUpdated: EventEmitter<void> = new EventEmitter<void>();

  application: IApplicationDetails = {} as IApplicationDetails;
  sub!: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: number, private applicationService: ApplicationService, private dialogRef: MatDialogRef<UpdateApplicationComponent>) { }

  ngOnInit(): void {
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
          this.application.image = `${Base_Media_Url}${this.application.image}`;
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
    const requestBody = {
      id: this.application?.id,
      name: this.application?.name,
      image: this.application?.image?.replace(Base_Media_Url, ''),
      applicationConstraints: this.application?.applicationConstraints
    };

    this.sub = this.applicationService.updateApplication(requestBody).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.applicationUpdated.emit();

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

    if (this.application) {
      this.application.image = file.name;
    }
  }

  addNewConstraint() {
    this.application?.applicationConstraints.push({ key: '', defaultAction: '' });
  }

  removeConstraint(index: number) {
    this.application?.applicationConstraints.splice(index, 1);
  }
}
