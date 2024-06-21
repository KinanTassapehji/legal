import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { IApplication } from '../../../interfaces/application';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SubscriptionPlanService } from '../../../services/subscription-plan.service';
import { ApplicationService } from '../../../services/application.service';
import { IApplicationConstraint } from '../../../interfaces/application-constraint';
import { GetConflictMessage, GetCreateFailedMessage } from '../../../constants/messages-constants';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';

@Component({
  selector: 'app-add-subscription-plan',
  templateUrl: './add-subscription-plan.component.html',
  styleUrl: './add-subscription-plan.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class AddSubscriptionPlanComponent implements OnInit, OnDestroy {
  @Output() subscriptionPlanAdded: EventEmitter<void> = new EventEmitter<void>();

  sub!: Subscription;
  name: string = '';
  applicationId: number = 0;
  applicationConstraints: IApplicationConstraint[] = [];
  progressBar = false;
  modelName: string = 'Subscription plan';

  constructor(
    private matDialog: MatDialog,
    private subscriptionPlanService: SubscriptionPlanService,
    private applicationService: ApplicationService,
    private dialogRef: MatDialogRef<AddSubscriptionPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { applications: IApplication[], selectedApplicationId: number }) {
  }

  ngOnInit(): void {
    this.applicationId = this.data.selectedApplicationId;
    this.getApplicationConstraints();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addSubscriptionPlan() {
    this.progressBar = true;
    const subscriptionPlanApplicationConstraint = this.applicationConstraints.map(constraint => ({
      applicationConstraintId: constraint.id,
      defaultValue: constraint.value
    }));

    const requestBody = {
      name: this.name,
      applicationId: this.applicationId,
      subscriptionPlanApplicationConstraint: subscriptionPlanApplicationConstraint
    };

    this.sub = this.subscriptionPlanService.createSubscriptionPlan(requestBody).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.subscriptionPlanAdded.emit(response.data.id);
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
        console.error('Error creating subscription plan', err);
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

  getApplicationConstraints() {
    if (this.applicationId !== 0) {
      this.sub = this.applicationService
        .getApplicationConstraintsByApplicationId(this.applicationId)
        .subscribe({
          next: (constraints) => {
            this.applicationConstraints = constraints;

            // Set all enabled properties to true
            this.applicationConstraints.forEach(constraint => {
              constraint.enabled = true;
            });
          },
          error: (err) => {
            console.error('Error getting application constraints', err);
          }
        });
    }
  }

  onApplicationSelectionChange(): void {
    // Get application constraints based on the selected application
    this.getApplicationConstraints();
  }

  toggleChanged(event: any, constraint: IApplicationConstraint) {
    constraint.enabled = event.checked;
    if (!event.checked) {
      constraint.value = undefined;
      constraint.unlimited = false;
    }
  }

  onUnlimitedChanged(event: any, constraint: IApplicationConstraint) {
    constraint.unlimited = event.checked;
    if (event.checked) {
      constraint.value = undefined;
      constraint.enabled = true;
    }
  }
}
