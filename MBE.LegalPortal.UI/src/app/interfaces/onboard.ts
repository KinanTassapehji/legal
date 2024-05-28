import { IAccount } from "./account";
import { IApplicationInstance } from "./application-instance";
import { ILicense } from "./license";

export interface IOnBoard {
  accountName: string,
  accountEmail: string,
  accountPhoneNumber: string,
  applicationInstanceName: string,
  applicationId:number,
  tenantName: string,
  tenantEmail: string,
  tenantUrl: string,
  expiryDate: Date,
  expiryAction: string,
  environment: string,
  subscriptionPlanId: number | undefined,
  createConstraints: any
}
