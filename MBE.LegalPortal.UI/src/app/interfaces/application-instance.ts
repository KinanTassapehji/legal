import { IAccount } from "./account";
import { ITenant } from "./tenant";

export interface IApplicationInstance {
  id: number,
  name: string,
  account: IAccount,
  tenants: ITenant[],
  createdOn: Date,
}
