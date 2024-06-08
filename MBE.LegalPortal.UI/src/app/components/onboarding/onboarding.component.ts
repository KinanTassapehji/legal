import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs/internal/Subscription';
import { IApplication } from '../../interfaces/application';
import { ApplicationService } from '../../services/application.service';
import { IConstraint, ISubscriptionPlan } from '../../interfaces/subscription-plan';
import { SubscriptionPlanService } from '../../services/subscription-plan.service';
import { IOnBoard } from '../../interfaces/onboard';
import { IAccount } from '../../interfaces/account';
import { IApplicationInstance } from '../../interfaces/application-instance';
import { ILicense } from '../../interfaces/license';
import { OnboardService } from '../../services/onboard.service';
import { Router } from '@angular/router';
import { AddSubscriptionPlanComponent } from '../subscription-plan/add-subscription-plan/add-subscription-plan.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../shared/custom-snackbar/snackbar.service';
import { GetCreateSuccessfullyMessage } from '../../constants/messages-constants';
import { MessageType } from '../../enums/messageType';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class OnboardingComponent {
  isLoading = true;
  isnextTab = true;
  progressBar = false;
  isApplicationDisabled = true;
  isSubscriptionPlanDisabled = true;
  isSelectionChanged = false;
  isLicenseDisabled = true;
  isSubscriptionPlanSelected = false;
  buttonEvent: any;
  errorMessage: string = '';
  modelName : string = 'License';
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
  selectedsubscriptionPlan: ISubscriptionPlan = { id: 0, name: '', constraints: [], };
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
  licenseFieldsChange = false;
  // Array to hold tab labels
  tabLabels: string[] = ['Account', 'Application', 'Subscription Plan', 'License'];
  constructor(private applicationService: ApplicationService,
    private subscriptionPlanService: SubscriptionPlanService,
    private onBoardService: OnboardService,
    private router: Router,
    private matDialog: MatDialog, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.getApplications();
  }

  // create new license...
  openAddSubscriptionPlanDialog() {
    const dialogRef = this.matDialog.open(AddSubscriptionPlanComponent, {
      width: "800px",
      data: {
        applications: this.applications, // Pass applications data to the child component
        selectedApplicationId: this.selectedApplication?.id
      }
    });

    dialogRef.componentInstance.subscriptionPlanAdded.subscribe(() => {
      if (this.selectedApplication) {
        this.getSubscriptionPlans(this.selectedApplication.id); // Refresh the list of subscription plans
        if (this.subscriptionPlans.length > 0) {
          this.selectPlan(this.subscriptionPlans[this.subscriptionPlans.length - 1].name);
        }
      } else {
        console.error("selected Application is undefined");
      }
    });
  }

  // Method to handle tab change event
  onTabChanged(event: MatTabChangeEvent): void {
    this.selectedIndex = event.index;
  }

  // Method to navigate to the next tab
  nextTab(): void {
    this.checkTabValidation();
  }

  // Method to navigate to the previous tab
  previousTab(): void {
    this.isnextTab = true;
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
    if (this.selectedIndex + 1 === 3 && !this.isSubscriptionPlanSelected) {
      this.errorMessage = 'Please choose your subscription plan';
      this.isnextTab = false;
    }

    //next tab....
    if (this.isnextTab) {
      if (this.selectedIndex < this.tabLabels.length - 1) {
        this.selectedIndex++;
        this.errorMessage = '';
      }
    }
  }

  //show error message for invalid data.
  showErrorMessage(tabName: any) {
    this.errorMessage = tabName === 'SubscriptionPlan' ?
      'Subscription plan not found' :
      `${tabName} fields are required!`
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
    this.licenseFieldsChange = true;
    this.isLicenseDisabled = isInvalid;
    this.errorMessage = '';
  }

  // get date.
  onDateChange(value: any) {
    this.expiryDate = value;
  }

  // get list of applications...
  getApplications() {
    this.sub = this.applicationService.getApplications().subscribe({
      next: response => {
        this.applications = response;

        // Set isLoading to false
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err;

        // Set isLoading to false 
        this.isLoading = false;
      }
    });
  }

  // get applicationInstance....
  onSelectCheckApplicationValidation(isInvalid: any) {
    this.isSelectionChanged = true;
    this.checkApplicationFields(isInvalid);
    this.onApplicationSelectionClick();
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

  // get constraints value..
  getConstraintValue(plan: ISubscriptionPlan, key: string): any {
    const constraint = plan.constraints.find(constraint => constraint.key === key);
    return constraint && constraint.defaultValue !== undefined && constraint.defaultValue > 0 ? constraint.defaultValue : '-';
  }

  //Get Selected Plan
  selectPlan(planName: any, event: any = null) {
    if (planName) {
      // clear the previous button and set as default....
      if (this.buttonEvent) {
        this.buttonEvent.srcElement.classList.remove("selected-choose-plan-button");
        this.buttonEvent.srcElement.classList.add("choose-plan-button");
      }
      // check the subscription plan...
      this.selectedsubscriptionPlan = this.subscriptionPlans.filter(x => { return x.name === planName; })[0];
      if (this.selectedsubscriptionPlan) {
        if (event) {
          // show active button
          event.srcElement.classList.remove("choose-plan-button");
          setTimeout(() => {
            event.srcElement.classList.add("selected-choose-plan-button");
          }, 100);
          this.buttonEvent = event;
        }
        this.isSubscriptionPlanSelected = true;
        this.nextTab();
      } else {
        this.errorMessage = 'Subscription plan not found';
        this.isSubscriptionPlanSelected = false;
      }
    }
  }

  //submit the onboard details
  finished() {
    if (this.isLicenseDisabled || !this.licenseFieldsChange) {
      this.showErrorMessage("License");
      return;
    }
    this.progressBar = true;
    //get application constraints from selected plan...
    let applicationConstraints = this.selectedsubscriptionPlan.constraints[0] as any;
    // create new constraints with new object...
    let createConstraint = {
      "applicationConstraintId": applicationConstraints.id,
      "value": applicationConstraints.defaultValue,
      "action": this.expiryAction
    }
    // create onboard Dto...
    this.onBoard = {
      "accountName": this.Name,
      "accountEmail": this.Email,
      "accountPhoneNumber": '+' + this.PhoneNumber,
      "applicationInstanceName": this.Name,
      "applicationId": this.applicationId,
      "tenantName": this.tenantName,
      "tenantEmail": this.tenantEmail,
      "tenantUrl": 'https://' + this.tenantUrl,
      "expiryDate": new Date(this.expiryDate),
      "expiryAction": this.expiryAction,
      "environment": this.environment,
      "subscriptionPlanId": this.selectedsubscriptionPlan.id,
      "createConstraints": [createConstraint]
    };
    //post the results using onboard service...
    this.sub = this.onBoardService.createOnBoardService(this.onBoard).subscribe({
      next: response => {
        if (response.data?.id > 0) {
          this.snackbarService.show(GetCreateSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
          this.router.navigate(['/license']);
          this.progressBar = false;
        }
      },
      error: err => {
        this.errorMessage = err
        this.progressBar = false;
      }
    });
  }
}
