import { Component, OnDestroy, OnInit } from '@angular/core';
import { IConstraint, ISubscriptionPlan } from '../../interfaces/subscription-plan';
import { Subscription } from 'rxjs';
import { SubscriptionPlanService } from "../../services/subscription-plan.service";
import { MatDialog } from '@angular/material/dialog';
import { AddSubscriptionPlanComponent } from './add-subscription-plan/add-subscription-plan.component';
import { IApplication } from '../../interfaces/application';
import { ApplicationService } from '../../services/application.service';
import { ConfirmationPopupComponent } from '../../shared/popups/confirmation-popup/confirmation-popup.component';
import { UpdateSubscriptionPlanComponent } from './update-subscription-plan/update-subscription-plan.component';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../shared/custom-snackbar/snackbar.service';
import { GetCreateSuccessfullyMessage, GetDeleteSuccessfullyMessage, GetUpdateSuccessfullyMessage } from '../../constants/messages-constants';
import { MessageType } from '../../enums/messageType';
import { ErrorPopupComponent } from '../../shared/popups/error-popup/error-popup.component';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss']
})

export class SubscriptionPlanComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  sub!: Subscription;
  subscriptionPlans: ISubscriptionPlan[] = [];
  applications: IApplication[] = [];
  selectedApplication: IApplication | undefined;
  defaultApplication: IApplication | undefined;
  constraints: IConstraint[] = [];
  modelName : string = 'Subscription Plan';
  errorMessage = '';
  isLoading = true;
  constructor(private subscriptionPlanService: SubscriptionPlanService,
    private applicationService: ApplicationService,
    private matDialog: MatDialog,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.getApplications();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getApplications() {
    this.sub = this.applicationService.getApplications().subscribe({
      next: applications => {
        this.applications = applications;

        // Check if there are applications
        if (this.applications.length > 0) {
          // Set the first application as selected
          this.selectedApplication = applications[0];
          this.defaultApplication = this.selectedApplication;
          this.selectedApplication.selected = true;
          this.selectedApplication.isDefault = true;
          this.getSubscriptionPlans(this.selectedApplication.id);
        }

        // Set isLoading to false and emit progress bar state after successful response
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err;

        // Set isLoading to false and emit progress bar state on error
        this.isLoading = false;
      }
    });
  }

  getSubscriptionPlans(applicationId: number) {
    this.sub = this.subscriptionPlanService.getSubscriptionPlans(applicationId).subscribe({
      next: subscriptionPlans => {
        this.subscriptionPlans = subscriptionPlans;
        this.generateDataSource(); // Generate dataSource and displayedColumns
      },
      error: err => this.errorMessage = err
    });
  }

  generateDataSource(): void {
    if (this.selectedApplication) {
      this.sub = this.applicationService.getApplicationById(this.selectedApplication?.id).subscribe({
        next: application => {
          if (application && application.applicationConstraints && application.applicationConstraints.length > 0) {
            this.constraints = application.applicationConstraints.map(constraint => ({
              id: constraint.id || 0,
              key: constraint.key,
              defaultValue: constraint.value || 0
            }));

            // Iterate over existing constraints
            this.constraints.forEach(existingConstraint => {
              // Check if corresponding constraint exists in plan.constraints
              const correspondingConstraint = this.subscriptionPlans.flatMap(plan => plan.constraints)
                .find(constraint => constraint.key === existingConstraint.key);

              // If corresponding constraint doesn't exist, add it
              if (!correspondingConstraint) {
                this.subscriptionPlans.forEach(plan => {
                  plan.constraints.push({
                    id: 0,
                    key: existingConstraint.key,
                    defaultValue: existingConstraint.defaultValue
                  });
                });
              }
            });

            this.displayedColumns = ['Constraints'];
            this.subscriptionPlans.forEach(plan => {
              this.displayedColumns.push(plan.name);
            });

            this.dataSource = this.constraints.map(constraint => {
              const rowData: any = { Constraints: constraint.key };
              this.subscriptionPlans.forEach(plan => {
                rowData[plan.name] = this.getConstraintValue(plan, constraint.key);
              });
              return rowData;
            });
          }
          else {
            this.dataSource = [];
          }
        },
        error: err => {
          this.errorMessage = err;
        }
      });
    }
  }

  getConstraintValue(plan: ISubscriptionPlan, key: string): any {
    const constraint = plan.constraints.find(constraint => constraint.key === key);
    return constraint && constraint.defaultValue !== undefined && constraint.defaultValue > 0 ? constraint.defaultValue : '-';
  }

  setApplicationAsDefault(id: number) {
    // Loop through all applications
    this.applications.forEach(app => {
      // Set isDefault to true for the application with the given ID
      app.isDefault = app.id === id;
    });

    // Find the application with the given ID
    const defaultApp = this.applications.find(app => app.id === id);

    // Set the found application as the defaultApplication
    this.defaultApplication = defaultApp;
  }

  onCardClick(id: number) {
    // Loop through all applications
    this.applications.forEach(app => {
      // Set selected to true for the application with the given ID
      app.selected = app.id === id;
    });

    // Find the application with the given ID
    const selectedApp = this.applications.find(app => app.id === id);

    // Set the found application as the selectedApplication
    this.selectedApplication = selectedApp;

    this.getSubscriptionPlans(id);
  }

  openAddSubscriptionPlanDialog() {
    const dialogRef = this.matDialog.open(AddSubscriptionPlanComponent, {
      width: "800px",
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: {
        applications: this.applications, // Pass applications data to the child component
        selectedApplicationId: this.selectedApplication?.id
      }
    });

    dialogRef.componentInstance.subscriptionPlanAdded.subscribe(() => {
      if (this.selectedApplication) {
        this.snackbarService.show(GetCreateSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
        this.getSubscriptionPlans(this.selectedApplication.id); // Refresh the list of subscription plans
      } else {
        console.error("selected Application is undefined");
      }
    });
  }

  openUpdateSubscriptionPlanDialog(name: string) {
    let subscriptionPlan = this.subscriptionPlans.find(x => x.name === name);

    const dialogRef = this.matDialog.open(UpdateSubscriptionPlanComponent, {
      width: "800px",
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: {
        subscriptionPlan: subscriptionPlan,
        selectedApplication: this.selectedApplication
      }
    });

    dialogRef.componentInstance.subscriptionPlanUpdated.subscribe(() => {
      if (this.selectedApplication) {
        this.snackbarService.show(GetUpdateSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
        this.getSubscriptionPlans(this.selectedApplication.id); // Refresh the list of subscription plans
      } else {
        console.error("selected Application is undefined");
      }
    });
  }

  openDeleteSubscriptionPlanDialog(name: string) {
    const dialogRef = this.matDialog.open(ConfirmationPopupComponent, {
      width: "400px",
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: `"${name}" ${this.modelName}`,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSubscriptionPlan(name);
      }
    });
  }

  deleteSubscriptionPlan(name: string) {
    // Call the delete service
    let id = this.subscriptionPlans.find(x => x.name === name)?.id;
    this.subscriptionPlanService.deleteSubscriptionPlan(id).subscribe({
      next: () => {
        // Update the UI
        if (this.selectedApplication) {
          this.snackbarService.show(GetDeleteSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
          this.getSubscriptionPlans(this.selectedApplication.id);
        }
      },
      error: err => {
        // Extract the detailed error message if available
        let errorMessage = GetDeleteSuccessfullyMessage(this.modelName);
        if (err && err.error && err.error.messages) {
          errorMessage = err.error.messages.join(', ');
        }

        // Display the error message in a dialog
        this.matDialog.open(ErrorPopupComponent, {
          width: '500px',
          disableClose: true, // Prevent closing the dialog by clicking outside
          data: { title: 'Error', message: errorMessage }
        });
      }
    });
  }
}
