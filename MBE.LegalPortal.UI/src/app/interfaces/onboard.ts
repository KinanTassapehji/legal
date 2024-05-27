import { IAccount } from "./account";
import { IApplicationInstance } from "./application-instance";
import { ILicense } from "./license";

export interface IOnBoard {
  AccountName: string,
  AccountEmail: string,
  AccountPhoneNumber: string,
  ApplicationInstanceName: string,
  ApplicationId:number,
  TenantName: string,
  TenantEmail: string,
  TenantUrl: string,
  ExpiryDate: Date,
  ExpiryAction: string,
  Environment: string,
  SubscriptionPlanId: number | undefined,
  CreateConstraints: any[]
}
