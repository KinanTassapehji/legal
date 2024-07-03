import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { LicenseService } from '../../../services/license.service';
import { SubscriptionPlanService } from '../../../services/subscription-plan.service';
import { ApplicationService } from '../../../services/application.service';
import { IApplication } from '../../../interfaces/application';
import { AccountService } from '../../../services/account.service';
import { IAccount } from '../../../interfaces/account';
import { IApplicationInstance } from '../../../interfaces/application-instance';
import { ITenant } from '../../../interfaces/tenant';
import { ISubscriptionPlan } from '../../../interfaces/subscription-plan';
import { TenantService } from '../../../services/tenant.service';
import { ExpiryType } from '../../../enums/expiryType';
import { ViolationPolicy } from '../../../enums/ViolationPolicy';
import { GetConflictMessage, GetUpdateFailedMessage } from '../../../constants/messages-constants';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';

@Component({
  selector: 'app-update-license',
  templateUrl: './update-license.component.html',
  styleUrl: './update-license.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UpdateLicenseComponent {
  @Output() licenseUpdated: EventEmitter<void> = new EventEmitter<void>();
  //declaration objects using interfaces...
  applications: IApplication[] = [];
  accounts: IAccount[] = [];
  applicationInstance: IApplicationInstance[] = [];
  tenants: ITenant[] = [];
  subscriptionPlans: ISubscriptionPlan[] = [];
  applicationConstraints: any[] = [];
  sub!: Subscription;
  //declaration integer type variables...
  subscriptionPlanId: number = 0;
  applicationId: number = 0;
  accountId: number = 0;
  applicationInstanceId: number = 0;
  tenantId: number = 0;
  currentSelectedLicenseId: number = 0;
  //declaration string type variables...
  environmentId: string = '';
  expiryDate: string = '';
  expiryAction: string = '';
  maximumMachines: number = 1;
  maximumRemainingDaysToEscalate: number = 1;
  expiryTypeEnum = ExpiryType; // Enum reference
  expiryType: ExpiryType = ExpiryType.Limited;
  violationPolicies = Object.keys(ViolationPolicy);
  progressBar = false;
  environment = [{ environmentId: "Staging", environmentName: "Staging" },
  { environmentId: "Production", environmentName: "Production" }
  ];
  modelName: string = 'License';

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: any,
    private matDialog: MatDialog,
    private licenseService: LicenseService,
    private subscriptionPlanService: SubscriptionPlanService,
    private applicationService: ApplicationService,
    private accountService: AccountService,
    private tenantService: TenantService,
    private dialogRef: MatDialogRef<UpdateLicenseComponent>) { }

  ngOnInit(): void {
    this.getLicenseDetails(this.data);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getLicenseDetails(id: any) {
    this.progressBar = true;
    this.sub = this.licenseService.getLicenseById(id).subscribe({
      next: response => {
        this.applicationConstraints = [];
        this.tenants = [response.tenant];
        this.tenantId = response.tenant.id;
        this.subscriptionPlans = [response.subscriptionPlan];
        this.subscriptionPlanId = response.subscriptionPlan.id;
        this.environmentId = response.environment;
        this.expiryAction = response.expiryAction;
        this.expiryDate = response.expiryDate.toString();
        this.creatApplicationConstraints(response.constraints);
        this.maximumMachines = response.maximumMachines;
        this.maximumRemainingDaysToEscalate = response.maximumRemainingDaysToEscalate;
        this.expiryType = response.expiryType;
        this.accountId = response.account.id;
        this.applicationId = response.application.id;
        this.getApplications();
        this.getAccounts();
        this.getSubscriptionPlans();
        this.getApplicationConstraints();
        this.getTenantsApplicationInstance(this.tenantId);
        this.progressBar = false;
      }
    });
  }

  selectSubscriptionPlanId(event: any) {
    this.subscriptionPlanId = event.value;
    this.getApplicationConstraints();
  }

  getApplications() {
    this.sub = this.applicationService.getApplications().subscribe({
      next: response => {
        let application = response.filter(x => { return x.id === this.applicationId; });
        this.applications = application;
      }
    });
  }

  getAccounts() {
    this.sub = this.accountService.getAccountsAll().subscribe({
      next: response => {
        let account = response.filter(x => { return x.id === this.accountId; });
        this.accounts = account;
      }
    });
  }

  getTenantsApplicationInstance(id: number) {
    this.sub = this.tenantService.getTenantById(id).subscribe({
      next: response => {
        let data = response;
        if (data) {
          this.applicationInstance = [data.applicationInstance];
          console.log('Selected application Instance:', this.applicationInstance)
          this.applicationInstanceId = data.applicationInstance.id;
        }
      }
    })
  }

  getSubscriptionPlans() {
    this.subscriptionPlans = [];
    console.log('responseSubscriptionPlanapplicationId', this.applicationId);
    this.sub = this.subscriptionPlanService.getSubscriptionPlans(this.applicationId).subscribe({
      next: responseSubscriptionPlan => {
        console.log('responseSubscriptionPlan', responseSubscriptionPlan);
        this.subscriptionPlans = responseSubscriptionPlan;
      }
    });
  }

  getApplicationConstraints() {
    this.applicationConstraints = [];
    console.log('getApplicationConstraints', this.applicationConstraints);
    this.sub = this.subscriptionPlanService.getSubscriptionPlansById(this.subscriptionPlanId).subscribe({
      next: response => {
        let applicationConstaintsList = response.data.applicationConstraints;
        this.creatApplicationConstraints(applicationConstaintsList);
      }
    });
  }

  creatApplicationConstraints(applicationConstaintsList: any) {
    if (applicationConstaintsList.length > 0) {
      for (var i = 0; i < applicationConstaintsList.length; i++) {
        let action = applicationConstaintsList[i].defaultAction === undefined ? applicationConstaintsList[i].action : applicationConstaintsList[i].defaultAction;
        let applicationConstraintId = applicationConstaintsList[i].id === undefined ? applicationConstaintsList[i].applicationConstraintId : applicationConstaintsList[i].id;
        let value = applicationConstaintsList[i].defaultValue === undefined ? applicationConstaintsList[i].value : applicationConstaintsList[i].defaultValue;
        let Constraints = {
          "applicationConstraintId": applicationConstraintId,
          "value": value,
          "action": action
        };
        this.applicationConstraints.push(Constraints);
      }
    }
  }

  onDateChange(value: any) {
    this.expiryDate = value;
  }

  updateLicense() {
    this.progressBar = true;
    let requestBody = {
      "maximumMachines": this.maximumMachines,
      "maximumRemainingDaysToEscalate": this.maximumRemainingDaysToEscalate,
      "expiryType": this.expiryType,
      "expiryDate": this.expiryDate,
      "expiryAction": this.expiryAction,
      "environment": this.environmentId,
      "tenantId": this.tenantId,
      "subscriptionPlanId": this.subscriptionPlanId,
      "Constraints": this.applicationConstraints
    };
    this.licenseService.updateLicense(this.data, requestBody).subscribe({
      next: response => {
        // Emit event to notify parent component
        this.licenseUpdated.emit(response);
        // Close the dialog
        this.dialogRef.close();
        this.progressBar = false;
      },
      error: err => {
        let errorMessage = GetUpdateFailedMessage(this.modelName);
        if (err.status === 409) {
          // Handle 409 Conflict as a successful response
          errorMessage = GetConflictMessage(this.modelName);
        }
        else {
          // Extract the detailed error message if available
          console.error('Error updating license', err);
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
}
