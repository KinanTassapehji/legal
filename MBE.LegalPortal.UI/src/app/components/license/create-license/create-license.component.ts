import { Component, EventEmitter, Output } from '@angular/core';
import { LicenseService } from '../../../services/license.service';
import { MatDialogRef } from '@angular/material/dialog';
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

@Component({
  selector: 'app-create-license',
  templateUrl: './create-license.component.html',
  styleUrl: './create-license.component.scss'
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
  environment: string = '';
  expiryDate: string = '';
  expiryAction: string = '';
  applicationConstraints: any[] = [];
  constructor(private licenseService: LicenseService,
    private applicationService: ApplicationService,
    private accountService: AccountService,
    private subscriptionPlanService: SubscriptionPlanService,
    private applicationInstanceService: ApplicationInstanceService,
    private dialogRef: MatDialogRef<CreateLicenseComponent>) { }

  ngOnInit(): void {
    this.getApplications();
  }

  addLicense() {
    let requestBody = {
      "expiryDate": this.expiryDate,
      "expiryAction": this.expiryAction,
      "environment": this.environment,
      "tenantId": this.tenantId,
      "subscriptionPlanId": this.subscriptionPlanId,
      "Constraints": this.applicationConstraints
    };
    this.sub = this.licenseService.createLicense(requestBody).subscribe({
      next: (response) => {
        // Emit event to notify parent component
        this.licenseAdded.emit(response.data);
        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        console.log('err', err);
        // Handle error response, maybe show an error message
        console.error('Error creating application instance', err);
      }
    });
  }

  OnDateChange(value: any) {
    this.expiryDate = value;
  }
  getApplications() {
    this.sub = this.applicationService.getApplications().subscribe({
      next: response => {
        this.applications = response;
        this.getAccounts();
        this.getSubscriptionPlans();
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
    this.sub = this.subscriptionPlanService.getSubscriptionPlans().subscribe({
      next: response => {
        this.subscriptionPlans = response;
      }
    });
  }

  getApplicationInstance() {
    this.applicationInstance = [];
    this.tenants = [];
    if (this.accountId > 0 && this.applicationId > 0) {
      this.sub = this.applicationInstanceService.getApplicationInstance(this.accountId, this.applicationId).subscribe({
        next: response => {
          if (response.data.length > 0) {
            this.applicationInstance = [response.data[0].application];
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
