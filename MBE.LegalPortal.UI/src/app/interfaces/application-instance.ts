import { IAccount } from "./account";
import { IApplication } from "./application";
import { ITenant } from "./tenant";

export interface IApplicationInstance {
  id: number,
  name: string,
  application: IApplication,
  account: IAccount,
  tenants: ITenant[],
  createdOn: Date,
}
