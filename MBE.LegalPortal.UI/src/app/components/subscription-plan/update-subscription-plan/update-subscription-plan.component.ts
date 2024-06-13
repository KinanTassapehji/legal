import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { IApplicationConstraint } from '../../../interfaces/application-constraint';
import { SubscriptionPlanService } from '../../../services/subscription-plan.service';
import { ApplicationService } from '../../../services/application.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IApplication } from '../../../interfaces/application';
import { ISubscriptionPlan } from '../../../interfaces/subscription-plan';

@Component({
  selector: 'app-update-subscription-plan',
  templateUrl: './update-subscription-plan.component.html',
  styleUrl: './update-subscription-plan.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UpdateSubscriptionPlanComponent implements OnInit, OnDestroy {
  @Output() subscriptionPlanUpdated: EventEmitter<void> = new EventEmitter<void>();

  sub!: Subscription;
  name: string = '';
  applicationId: number = 0;
  applicationName: string = '';
  applicationConstraints: IApplicationConstraint[] = [];
  progressBar = false;

  constructor(
    private subscriptionPlanService: SubscriptionPlanService,
    private applicationService: ApplicationService,
    private dialogRef: MatDialogRef<UpdateSubscriptionPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subscriptionPlan: ISubscriptionPlan, selectedApplication: IApplication }) {
  }

  ngOnInit(): void {
    this.name = this.data.subscriptionPlan.name;
    this.applicationId = this.data.selectedApplication.id;
    this.applicationName = this.data.selectedApplication.name;
    this.getApplicationConstraints();
  }

  bindDefaultValue() {
    this.applicationConstraints.forEach(appConstraint => {
      const matchingConstraint = this.data.subscriptionPlan.constraints.find(constraint => constraint.key === appConstraint.key);
      if (matchingConstraint) {
        appConstraint.value = matchingConstraint.defaultValue !== undefined && matchingConstraint.defaultValue > 0 ? matchingConstraint.defaultValue : undefined;

        appConstraint.enabled =
          matchingConstraint.defaultValue !== undefined &&
            (matchingConstraint.defaultValue > 0 || matchingConstraint.defaultValue === -1) ? true : false;

        appConstraint.unlimited = matchingConstraint.defaultValue !== undefined && matchingConstraint.defaultValue === -1 ? true : false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  updateSubscriptionPlan() {
    this.progressBar = true;

    const subscriptionPlanApplicationConstraint = this.applicationConstraints.map(constraint => {
      let defaultValue;
      if (!constraint.enabled) {
        defaultValue = 0;
      } else if (constraint.unlimited) {
        defaultValue = -1;
      } else {
        defaultValue = constraint.value;
      }

      return {
        applicationConstraintId: constraint.id,
        defaultValue: defaultValue
      };
    });

    const requestBody = {
      id: this.data.subscriptionPlan.id,
      name: this.name,
      applicationId: this.applicationId,
      subscriptionPlanApplicationConstraint: subscriptionPlanApplicationConstraint
    };

    this.sub = this.subscriptionPlanService.updateSubscriptionPlan(requestBody).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.subscriptionPlanUpdated.emit(response.data.id);
        this.progressBar = false;
        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error updating subscription plan', err);
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
            this.bindDefaultValue();
          },
          error: (err) => {
            console.error('Error getting application constraints', err);
          }
        });
    }
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
