import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { IApplication } from '../../../interfaces/application';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SubscriptionPlanService } from '../../../services/subscription-plan.service';
import { ApplicationService } from '../../../services/application.service';
import { IApplicationConstraint } from '../../../interfaces/application-constraint';

@Component({
  selector: 'app-add-subscription-plan',
  templateUrl: './add-subscription-plan.component.html',
  styleUrl: './add-subscription-plan.component.scss'
})

export class AddSubscriptionPlanComponent implements OnInit, OnDestroy {
  @Output() subscriptionPlanAdded: EventEmitter<void> = new EventEmitter<void>();

  sub!: Subscription;
  name: string = '';
  applicationId: number = 0;
  applicationConstraints: IApplicationConstraint[] = [];

  constructor(
    private subscriptionPlanService: SubscriptionPlanService,
    private applicationService: ApplicationService,
    private dialogRef: MatDialogRef<AddSubscriptionPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { applications: IApplication[] }) {
  }

  ngOnInit(): void {
    this.applicationId = this.data?.applications[0]?.id;
    this.getApplicationConstraints();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addSubscriptionPlan() {
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

        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error creating application instance', err);
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
    constraint.value = 0;
  }
}
