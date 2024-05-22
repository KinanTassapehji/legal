import { IAccount } from "./account";
import { IApplicationInstance } from "./application-instance";
import { ILicense } from "./license";

export interface IOnBoard {
  account: IAccount,
  applicationId: number,
  subscriptionPlanId: number,
  applicationInstance: IApplicationInstance,
  tenants: any[],
  license: ILicense
}
