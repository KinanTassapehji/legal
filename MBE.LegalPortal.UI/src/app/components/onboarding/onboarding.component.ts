import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs/internal/Subscription';
import { IApplication } from '../../interfaces/application';
import { ApplicationService } from '../../services/application.service';
import { IConstraint, ISubscriptionPlan } from '../../interfaces/subscription-plan';
import { SubscriptionPlanService } from '../../services/subscription-plan.service';
import { IOnBoard } from '../../interfaces/onboard';
import { IAccount } from '../../interfaces/account';
import { IApplicationInstance } from '../../interfaces/application-instance';
import { formatDate } from '@angular/common';
import { ILicense } from '../../interfaces/license';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OnboardingComponent {
  isLoading = true;
  isnextTab = true;
  isApplicationDisabled = true;
  isSubscriptionPlanDisabled = true;
  isSelectionChanged = false;
  isLicenseDisabled = true;
  errorMessage: string ='';
  // Current selected tab index
  selectedIndex: number = 0;
  // import Subscription...
  sub!: Subscription;
  // Account Tab Fields....
  Name: string = '';
  Email: string = '';
  PhoneNumber: string = '';
  // Application Tab Fields...
  applicationId: number = 0;
  accountId: number = 0;
  applications: IApplication[] = [];
  selectedApplication: IApplication | undefined;
  //Tenant Tab Fields....
  tenant: any[] = [{}];
  tenantName: string = '';
  tenantEmail: string = '';
  tenantUrl: string = '';
  //Subscription Plan tab...
  subscriptionPlans: ISubscriptionPlan[] = [];
  constraints: IConstraint[] = [];
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  //License Tab Fields....
  environment: string = '';
  expiryDate: string = '';
  expiryAction: string = '';
  //oboard interface
  onBoard: IOnBoard | undefined;
  account: IAccount | undefined;
  applicationInstance: IApplicationInstance | undefined;
  license: ILicense | undefined;
  // Array to hold tab labels
  tabLabels: string[] = ['Account', 'Application', 'Subscription Plan', 'License'];
  constructor(private applicationService: ApplicationService,
    private subscriptionPlanService: SubscriptionPlanService) { }

  ngOnInit(): void {
    this.getApplications();
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  // Method to handle tab change event
  onTabChanged(event: MatTabChangeEvent): void {
    this.selectedIndex = event.index;
  }

  // Method to navigate to the next tab
  nextTab(): void {
    console.log('nextTab', this.selectedIndex);
    this.checkTabValidation();
    
  }

  // Method to navigate to the previous tab
  previousTab(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.errorMessage = '';
    }
  }

  //check tab fields and add validation
  checkTabValidation() {
    this.isnextTab = true;
    this.errorMessage = '';
    //check validation for accounts...
    if (this.selectedIndex === 0) {
      if (this.isApplicationDisabled) {
        this.showErrorMessage('Account');
        this.isnextTab = false;
        this.isApplicationDisabled = true;
        this.isSubscriptionPlanDisabled = true;
        this.isLicenseDisabled = true;
      } else {
        this.isApplicationDisabled = false;
      }
    }
    //check validation for applications...
    if (this.selectedIndex === 1) {
      if (this.isSubscriptionPlanDisabled) {
        this.showErrorMessage('Application');
        this.isnextTab = false;
        this.isSubscriptionPlanDisabled = true;
        this.isLicenseDisabled = true;
      } else {
        this.isSubscriptionPlanDisabled = false;
      }
    }
    //check validation for subscription Plan...
    if (this.selectedIndex === 2) {
      if (!this.dataSource || this.dataSource.length == 0) {
        this.showErrorMessage('SubscriptionPlan');
        this.isnextTab = false;
        this.isLicenseDisabled = true;
      } else {
        this.isLicenseDisabled = false;
      }
    }
    //
    if (this.isnextTab) {
      if (this.selectedIndex < this.tabLabels.length - 1) {
        this.selectedIndex++;
        this.errorMessage = '';
      }
    }
  }

  //show error message for invalid data.
  showErrorMessage(tabName: any) {
    this.errorMessage = tabName === 'SubscriptionPlan' ? 'Subscription plan not found': `${tabName} fields are required!`
  }

  // check account fields validations.
  checkAccountFields(isInvalid: any) {
    this.isApplicationDisabled = isInvalid;
    this.errorMessage = '';
  }

  // check application fields validations...
  checkApplicationFields(isInvalid: any) {
    isInvalid = this.isSelectionChanged === true && isInvalid === false ? false : true;
    this.isSubscriptionPlanDisabled = isInvalid;
    this.errorMessage = '';
  }

  // check license fields validation...
  checkLicenseFields(isInvalid: any) {
    this.isLicenseDisabled = isInvalid;
    this.errorMessage = '';
  }

  // get date.
  OnDateChange(value: any) {
    this.expiryDate = value;
  }

  // get list of applications...
  getApplications() {
    this.sub = this.applicationService.getApplications().subscribe({
      next: response => {
        this.applications = response;
      }
    });
  }

  // get applicationInstance....
  onSelectCheckApplicationValidation(isInvalid: any) {
    this.isSelectionChanged = true;
    this.checkApplicationFields(isInvalid);
    this.onApplicationSelectionClick();
  }

  // create application instance...
  createApplicationInstance() {
 
  }

  // select the application details while selecting the application name from dropdown.
  onApplicationSelectionClick() {
    // Loop through all applications
    this.applications.forEach(app => {
      // Set selected to true for the application with the given ID
      app.selected = app.id === this.applicationId;
    });
    // Find the application with the given ID
    const selectedApp = this.applications.find(app => app.id === this.applicationId);
    // Set the found application as the selectedApplication
    this.selectedApplication = selectedApp;
    this.getSubscriptionPlans(this.applicationId);
  }

  // get subscription plan using application Id....
  getSubscriptionPlans(applicationId: number) {
    this.sub = this.subscriptionPlanService.getSubscriptionPlans(applicationId).subscribe({
      next: subscriptionPlans => {
        this.subscriptionPlans = subscriptionPlans;
        this.generateDataSource(); // Generate dataSource and displayedColumns
      },
      error: err => this.errorMessage = err
    });
  }

  // generate the datasource for show the details of subscription plan in table view.
  generateDataSource(): void {
    if (this.selectedApplication) {
      console.log('subscriptionPlans1', this.selectedApplication);
      this.sub = this.applicationService.getApplicationById(this.selectedApplication?.id).subscribe({
        next: application => {
          if (application && application.applicationConstraints && application.applicationConstraints.length > 0) {
            this.constraints = application.applicationConstraints.map(constraint => ({
              id: constraint.id || 0,
              key: constraint.key,
              defaultValue: constraint.value || 0
            }));
            console.log('constraints', this.constraints);
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

  // get constraints value..
  getConstraintValue(plan: ISubscriptionPlan, key: string): any {
    const constraint = plan.constraints.find(constraint => constraint.key === key);
    return constraint && constraint.defaultValue !== undefined && constraint.defaultValue > 0 ? constraint.defaultValue : '-';
  }

  //submit the onboard details
  finished() {

    this.tenant.push({
      name: this.tenantName,
      email: this.tenantEmail,
      Url: this.tenantUrl
    });

    this.account = {
      id: 0,
      name: this.Name,
      email: this.Email,
      phoneNumber: this.PhoneNumber
    };

    this.license = {
      id: 0,
      environment: this.environment,
      expiryDate: new Date(this.expiryDate),
      expiryAction: this.expiryAction,
      subscriptionPlan: this.subscriptionPlans[0],
    };

    this.applicationInstance = {
      id: 0,
      name: this.Name,
      application: this.applications[0],
      account: this.account,
      tenants: this.tenant,
      createdOn: new Date(),
    };

    this.onBoard = {
      account: this.account,
      applicationId: this.applicationId,
      applicationInstance: this.applicationInstance,
      license: this.license,
      subscriptionPlanId: this.subscriptionPlans[0].id,
      tenants: this.tenant,
    };
  }
}
