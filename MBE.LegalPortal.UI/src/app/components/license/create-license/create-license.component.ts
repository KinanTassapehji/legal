import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { LicenseService } from '../../../services/license.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IApplication } from '../../../interfaces/application';
import { IAccount } from '../../../interfaces/account';
import { IApplicationInstance } from '../../../interfaces/application-instance';
import { ITenant } from '../../../interfaces/tenant';
import { ISubscriptionPlan } from '../../../interfaces/subscription-plan';
import { ApplicationService } from '../../../services/application.service';
import { AccountService } from '../../../services/account.service';
import { SubscriptionPlanService } from '../../../services/subscription-plan.service';
import { ApplicationInstanceService } from '../../../services/application-instance.service';
import { ExpiryType } from '../../../enums/expiryType';
import { ViolationPolicy } from '../../../enums/ViolationPolicy';
import { GetConflictMessage, GetCreateFailedMessage } from '../../../constants/messages-constants';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';

@Component({
  selector: 'app-create-license',
  templateUrl: './create-license.component.html',
  styleUrl: './create-license.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreateLicenseComponent {
  sub!: Subscription
  @Output() licenseAdded: EventEmitter<void> = new EventEmitter<void>();
  applications: IApplication[] = [];
  accounts: IAccount[] = [];
  applicationInstance: IApplicationInstance[] = [];
  tenants: ITenant[] = [];
  subscriptionPlans: ISubscriptionPlan[] = [];
  applicationId: number = 0;
  accountId: number = 0;
  applicationInstanceId: number = 0;
  tenantId: number = 0;
  subscriptionPlanId: number = 0;
  maximumMachines: number = 1;
  expiryTypeEnum = ExpiryType; // Enum reference
  expiryType: ExpiryType = ExpiryType.Limited;
  environment: string = '';
  expiryDate: string = '';
  expiryAction: string = '';
  applicationConstraints: any[] = [];
  violationPolicies = Object.keys(ViolationPolicy);
  progressBar = false;
  modelName: string = 'License';

  constructor(private matDialog: MatDialog, private licenseService: LicenseService,
    private applicationService: ApplicationService,
    private accountService: AccountService,
    private subscriptionPlanService: SubscriptionPlanService,
    private applicationInstanceService: ApplicationInstanceService,
    private dialogRef: MatDialogRef<CreateLicenseComponent>) { }

  ngOnInit(): void {
    this.getApplications();
  }

  addLicense() {
    this.progressBar = true;
    if (this.expiryType === this.expiryTypeEnum.UnLimited) {
      this.expiryAction = 'NoViolation';
      this.expiryDate = new Date(0).toISOString(); 
    }
    let requestBody = {
      "maximumMachines": this.maximumMachines,
      "expiryType": this.expiryType,
      "expiryDate": this.expiryDate,
      "expiryAction": this.expiryAction,
      "environment": this.environment,
      "tenantId": this.tenantId,
      "subscriptionPlanId": this.subscriptionPlanId,
      "constraints": this.applicationConstraints
    };
    this.sub = this.licenseService.createLicense(requestBody).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.licenseAdded.emit(response.data);
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
        console.error('Error creating license', err);
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

  OnDateChange(value: any) {
    this.expiryDate = value;
  }

  getApplications() {
    this.progressBar = true;
    this.sub = this.applicationService.getApplications().subscribe({
      next: response => {
        this.applications = response;
        this.getAccounts();
        this.progressBar = false;
      }
    });
  }

  getAccounts() {
    this.sub = this.accountService.getAccountsAll().subscribe({
      next: response => {
        this.accounts = response;
      }
    });
  }

  getSubscriptionPlans() {
    this.subscriptionPlans = [];
    this.sub = this.subscriptionPlanService.getSubscriptionPlans(this.applicationId).subscribe({
      next: response => {
        this.subscriptionPlans = response;
      }
    });
  }

  getApplicationInstance() {
    this.applicationInstance = [];
    this.tenants = [];
    if (this.applicationId > 0) {
      this.getSubscriptionPlans();
    }
    if (this.accountId > 0 && this.applicationId > 0) {
      this.sub = this.applicationInstanceService.getApplicationInstance(this.accountId, this.applicationId).subscribe({
        next: response => {
          if (response.data.length > 0) {
            this.applicationInstance = [response.data[0]];
            this.tenants = response.data[0].tenants;
          }
        }
      });
    }
  }

  getApplicationConstraints() {
    this.applicationConstraints = [];
    this.sub = this.subscriptionPlanService.getSubscriptionPlansById(this.subscriptionPlanId).subscribe({
      next: response => {
        let applicationConstaintsList = response.data.applicationConstraints;
        if (applicationConstaintsList.length > 0) {
          for (var i = 0; i < applicationConstaintsList.length; i++) {
            let action = applicationConstaintsList[i].defaultAction;
            let applicationConstraintId = applicationConstaintsList[i].id;
            let value = applicationConstaintsList[i].defaultValue;
            let Constraints = {
              "applicationConstraintId": applicationConstraintId,
              "value": value,
              "action": action
            };
            this.applicationConstraints.push(Constraints);
          }
        }
      }
    });
  }
}
