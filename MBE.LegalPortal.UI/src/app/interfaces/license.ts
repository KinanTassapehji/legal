import { IAccount } from "./account";
import { IApplication } from "./application";
import { ISubscriptionPlan } from "./subscription-plan";
import { ITenant } from "./tenant";

export interface ILicense {
  id: number,
  environment: string,
  expiryDate: Date,
  expiryAction: string,
  subscriptionPlan: ISubscriptionPlan
}
