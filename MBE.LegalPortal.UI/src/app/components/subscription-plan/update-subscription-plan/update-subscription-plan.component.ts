import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { IApplicationConstraint } from '../../../interfaces/application-constraint';
import { SubscriptionPlanService } from '../../../services/subscription-plan.service';
import { ApplicationService } from '../../../services/application.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IApplication } from '../../../interfaces/application';
import { ISubscriptionPlan } from '../../../interfaces/subscription-plan';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-update-subscription-plan',
  templateUrl: './update-subscription-plan.component.html',
  styleUrl: './update-subscription-plan.component.scss'
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
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: { subscriptionPlan: ISubscriptionPlan, selectedApplication: IApplication }) {
  }

  ngOnInit(): void {
    this.progressBar = true;
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
        appConstraint.enabled = appConstraint.value !== undefined && appConstraint.value > 0 ? true : false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  updateSubscriptionPlan() {
    this.commonService.showAndHideProgressBar(true);
    const subscriptionPlanApplicationConstraint = this.applicationConstraints.map(constraint => ({
      applicationConstraintId: constraint.id,
      defaultValue: constraint.value
    }));

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
        this.commonService.showAndHideProgressBar(false);
        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error updating subscription plan', err);
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
            this.progressBar = false;
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
    constraint.value = undefined;
  }
}
