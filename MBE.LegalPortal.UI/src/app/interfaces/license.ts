import { ISubscriptionPlan } from "./subscription-plan";

export interface ILicense {
  id: number,
  environment: string,
  expiryDate: Date,
  expiryAction: string,
  subscriptionPlan: ISubscriptionPlan
}
