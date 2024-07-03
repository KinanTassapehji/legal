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
  maximumMachines: number,
  maximumRemainingDaysToEscalate: number,
  subscriptionPlanId: number | undefined,
  createConstraints: any
}
