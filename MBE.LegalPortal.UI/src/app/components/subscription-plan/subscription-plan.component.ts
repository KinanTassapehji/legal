import { Component, OnDestroy, OnInit } from '@angular/core';
import { IConstraint, ISubscriptionPlan } from '../../interfaces/subscription-plan';
import { Subscription } from 'rxjs';
import { SubscriptionPlanService } from "../../services/subscription-plan.service";
import { MatDialog } from '@angular/material/dialog';
import { AddSubscriptionPlanComponent } from './add-subscription-plan/add-subscription-plan.component';
import { IApplication } from '../../interfaces/application';
import { ApplicationService } from '../../services/application.service';

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
  constraints: IConstraint[] = [];
  errorMessage = '';

  constructor(private subscriptionPlanService: SubscriptionPlanService, private applicationService: ApplicationService, private matDialog: MatDialog) { }

  openDialog() {
    this.matDialog.open(AddSubscriptionPlanComponent, {
      width:"800px"
    });
  }

  ngOnInit(): void {
    this.getApplications();

    this.getSubscriptionPlans();
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
          this.applications[0].selected = true;
          this.getSubscriptionPlans(this.applications[0].id);
        }
      },
      error: err => this.errorMessage = err
    });
  }

  setApplicationAsDefault(id: number) {
    // Loop through all applications
    this.applications.forEach(app => {
      // Set selected to true for the application with the given ID
      app.selected = app.id === id;
    });

    // Find the application with the given ID
    const selectedApp = this.applications.find(app => app.id === id);

    // Set the found application as the selectedApplication
    this.selectedApplication = selectedApp;
  }

  onCardClick(id: number) {
    this.getSubscriptionPlans(id);
  }

  getSubscriptionPlans(applicationId?: number) {
      this.sub = this.subscriptionPlanService.getSubscriptionPlans(applicationId).subscribe({
        next: subscriptionPlans => {
          this.subscriptionPlans = subscriptionPlans;
          this.generateDataSource(); // Generate dataSource and displayedColumns
        },
        error: err => this.errorMessage = err
      });
  }

  generateDataSource(): void {
    this.constraints = this.getConstraints();
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

  getConstraints(): IConstraint[] {
    const constraints: IConstraint[] = [];
    this.subscriptionPlans.forEach(plan => {
      plan.constraints.forEach(constraint => {
        const existingConstraint = constraints.find(c => c.key === constraint.key);
        if (!existingConstraint) {
          constraints.push(constraint);
        }
      });
    });
    return constraints;
  }

  getConstraintValue(plan: ISubscriptionPlan, key: string): any {
    const constraint = plan.constraints.find(constraint => constraint.key === key);
    return constraint ? constraint.defaultValue : '-';
  }
}
